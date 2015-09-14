/// <reference path="jquery.d.ts" />
/// <reference path="util/RestClient.ts"/>
/// <reference path="authentication.ts" />
/// <reference path="common/model/FabTool.ts" />
/// <reference path="common/model/ToolUsage.ts" />
/// <reference path="common/model/User.ts" />
/// <reference path="util/Utils.ts" />

var reservation:Reservation = null;

class Reservation {
    _util:Utils = new Utils();
    maxUsageTime:number = 300;
    toolArray:Array<common.FabTool>;
    client:RestClient = null;
    static secretTokenKey = "ReservationToken";
    static ownIdList = "ReservationIdList";

    constructor() {
        $("#errorMessageDurationTime").hide();
        this.client = new RestClient();
        this.client.checkAuthentication();
        this.updateToolList();
    }

    public updateToolList() {
        var r:Reservation = this;
        this.client.requestGET("/drupal/tools", function (result) {
            r.updateToolListCallback(result)
        });
    }

    public updateToolListCallback(list) {
        this.toolArray = list;
        var select = $('#machineSelector');

        for (var index = 0; index < this.toolArray.length; index++) {
            var option = $(document.createElement('option'));
            option.val(String(this.toolArray[index].id));
            option.text(this.toolArray[index].title);
            option.appendTo(select);
        }
        select.prop("selectedIndex", 0);
    }

    public getUsageList(machineId:number) {
        if (machineId < 0) {
            this.usageListCallback(-1, null);
            return;
        }

        var r:Reservation = this;
        this.client.requestGET("/toolUsage/" + machineId + "/", function (result) {
            r.usageListCallback(machineId, result)
        });
    }

    public usageListCallback(machineId:number, results:Array<common.ToolUsage>) {
        $("#errorMessageDurationTime").hide();
        var table = $('#machineUsageTable');
        table.find("tbody").empty();


        if (machineId < 0) {
            this.disableAddEntry(true);
            return;
        }

        var user:common.User = Authentication.getUserInfo();
        var i:number = 0;
        for (var r in results) {

            var tr = $(document.createElement('tr'));
            var td_nr = $(document.createElement('td'));
            td_nr.text((i + 1).toString());
            td_nr.appendTo(tr);

            var td_user = $(document.createElement('td'));
            td_user.text(results[i].user);
            td_user.appendTo(tr);

            var td_proj = $(document.createElement('td'));
            td_proj.text(results[i].project);
            td_proj.appendTo(tr);


            var td_duration = $(document.createElement('td'));
            var duration = results[i].duration;
            var durationString = this._util.convertToHoursAndMinuteString(duration);
            if (i == 0) {
                var creationTimeInMilli = results[i].creationTime;
                var finishTime = creationTimeInMilli + duration * 60000; // duration -> minutes to millisec.
                var finishDate = new Date(finishTime);
                var timeString = finishDate.toLocaleTimeString();
                td_duration.text(durationString + " (" + timeString + " Uhr)");
            }
            else {
                td_duration.text(durationString);
            }
            td_duration.appendTo(tr);


            var td_delete = $(document.createElement('td'));

            if (user && (
                user.hasRole(common.Roles.ADMIN) ||
                user.username == results[r].user) ||
                this.isOwnId(results[r].id)
            ) {
                var deleteIcon = $(document.createElement('span'));

                deleteIcon.attr("class", "glyphicon glyphicon-remove");
                deleteIcon.attr("aria-hidden", "true");
                deleteIcon.attr("onClick", "reservation.deleteEntry(" + results[i].id + ");");
                deleteIcon.appendTo(td_delete);
            }
            td_delete.appendTo(tr);

            tr.appendTo(table);
            i++;
        }

        this.disableAddEntry(false);
        if (user) {
            var inputUser = $("#addEntryUser");
            inputUser.prop("disabled", true);
            inputUser.val(user.username);
        }
    }

    public getSelectedMachineId():number {
        return $("#machineSelector").val();
    }

    public loadTable() {
        var machineId:number = this.getSelectedMachineId();
        if (machineId != -1)
            this.getUsageList(machineId);
        else
            this.usageListCallback(-1, null);
    }

    public addEntry() {
        var usage:common.ToolUsage = new common.ToolUsage();

        var inputUser = $("#addEntryUser");
        var inputProj = $("#addEntryProject");
        var inputDuration = $("#addEntryDuration");

        if (inputUser.val().length == 0 || inputDuration.val().length == 0) {
            return;
        }

        if (parseInt(inputDuration.val()) > this.maxUsageTime) {
            $("#errorMessageDurationTime").show();
            return;
        }

        if (parseInt(inputDuration.val()) == 0) {
            return;
        }

        usage.toolId = this.getSelectedMachineId();
        usage.user = inputUser.val();
        usage.project = inputProj.val();

        usage.duration = parseInt(inputDuration.val());

        this.submitNewEntry(usage);
    }

    public submitNewEntry(usage:common.ToolUsage) {

        var r:Reservation = this;
        this.client.request("PUT", "/toolUsage/" + usage.toolId + "/" + this.getToken(), function (results) {
            r.callbackSubmitNewEntry(results);
        }, JSON.stringify(usage));
    }

    public callbackSubmitNewEntry(result) {
        if (result == null)
            return;

        if (this.getToken().length > 0) {
            this.addOwnId(result.id)
        }

        this.loadTable();
    }

    public deleteEntry(id:number) {
        var r:Reservation = this;
        this.client.request(
            "DELETE",
            "/toolUsage/" + this.getSelectedMachineId() + "/" + id + "/" + this.getToken(),
            function (results) {
                r.deleteEntryCallback(results);
            }
        );
    }

    public deleteEntryCallback(result) {
        this.loadTable();
    }

    public disableAddEntry(flag:boolean) {
        $("#addEntryUser").prop("disabled", flag);
        $("#addEntryProject").prop("disabled", flag);
        $("#addEntryDuration").prop("disabled", flag);
        $("#addEntrySubmit").prop("disabled", flag);
    }

    private getToken():string {
        var tokenAddon:string = "";
        if (!this.client.hasAuthentication()) {
            var token:string = localStorage.getItem(Reservation.secretTokenKey);
            if (token == null) {
                var d = new Date().getTime();
                token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                localStorage.setItem(Reservation.secretTokenKey, token);
            }
            tokenAddon = "?token=" + token;
        }
        return tokenAddon;
    }

    private addOwnId(id:number) {
        var idList:Array<number> = JSON.parse(localStorage.getItem(Reservation.ownIdList));
        if (idList == null) {
            idList = [];
        }
        idList.push(id);
        localStorage.setItem(Reservation.ownIdList, JSON.stringify(idList));
    }

    private isOwnId(id:number):boolean {
        var idList:Array<number> = localStorage.getItem(Reservation.ownIdList);
        if (idList == null) {
            return false;
        }

        return idList.indexOf(id) >= 0;
    }
}


$(document).ready(function () {
    reservation = new Reservation();
    reservation.disableAddEntry(true);

    // load list of usage items on change
    $("#machineSelector").change(function () {
        reservation.loadTable();
    });

    // register callback to add new entries
    $("#addEntrySubmit").click(function () {
        reservation.addEntry();
    });

    // set and initialise tooltip
    var tooltip:any = $("#toolUsage_tooltip");
    tooltip.prop("title", "Wähle eine Maschine aus dem Dropdown Menü aus, " +
        "fülle anschließend die drei gegebenen Felder entsprechend aus und trage dich per Klick in die Warteliste ein. " +
        "Du sieht anschließend die aktuelle Warteschlange und deine Position. Wenn du doch nicht mehr warten willst oder keine Zeit mehr hast," +
        " trage dich bitte wieder aus indem du auf das kleine X in deiner Zeile klickst.");
    tooltip.tooltip({placement: 'right'});
});