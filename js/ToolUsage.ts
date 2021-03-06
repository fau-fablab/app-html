/// <reference path="jquery.d.ts" />
/// <reference path="jqueryui.d.ts" />
/// <reference path="util/RestClient.ts"/>
/// <reference path="authentication.ts" />
/// <reference path="common/model/FabTool.ts" />
/// <reference path="common/model/ToolUsage.ts" />
/// <reference path="common/model/User.ts" />
/// <reference path="util/Utils.ts" />
/// <reference path="elements/InfoResource.ts"/>

var reservation:Reservation = null;
var _infoResource: InfoResource = new InfoResource();
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

        // check for admin user, if admin user, all tools should be disabled
        var url:string = "/toolUsage/tools";
        var user:common.User = Authentication.getUserInfo();
        if (user && user.hasRole(common.Roles.ADMIN)) {
            url = "/drupal/tools"
        }

        this.client.requestGET(url, function (result) {
            r.updateToolListCallback(result)
        });
    }

    public updateToolListCallback(list) {
        this.toolArray = list;
        var select = $('#machineSelector');
        var urlVars = this._util.getUrlVars();
        var preselection:boolean = false;

        var user:common.User = Authentication.getUserInfo();
        if (this.toolArray == null || this.toolArray.length == 0) {
            var disableLabel = $("#disableLabel");
            if (user && user.hasRole(common.Roles.ADMIN)) {
                disableLabel.toggle(false);
                select.prop("disabled", false);
            }
            else {
                disableLabel.toggle(true);
                select.prop("disabled", true);
            }
        }

        for (var i = 0; i < this.toolArray.length; i++) {
            var option = $(document.createElement('option'));
            option.val(String(this.toolArray[i].id));
            option.text(this.toolArray[i].title);
            option.appendTo(select);

            if (user && user.hasRole(common.Roles.ADMIN)) {
                if (this.toolArray[i].enabledForMachineUsage)
                    option.attr("class", "machineUsageEnabled");
                else
                    option.attr("class", "machineUsageDisabled");
            }

            if (urlVars["id"] && urlVars["id"] == this.toolArray[i].id) {
                option.attr("selected", true);
                preselection = true;
                this.getUsageList(urlVars["id"]);
            }
        }
        if (!preselection)
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
        var actionSelector = $("#actionSelector");
        actionSelector.empty();
        actionSelector.append('<option value="-1">--- Bitte Aktion auswählen ---</option>');
        actionSelector.append('<option value="deleteAll">Alle Einträge für diese Maschie entfernen</option>');

        // add some actions to action selector
        if (user && user.hasRole(common.Roles.ADMIN)) {
            var opt = $(document.createElement('option'));
            var tool:common.FabTool = this.findTool(machineId);

            if (tool) {
                if (tool.enabledForMachineUsage) {
                    opt.val("disableMachine");
                    opt.text("Maschine für die Reservierung deaktivieren");
                }
                else {
                    opt.val("enableMachine");
                    opt.text("Maschine für die Reservierung aktivieren");
                }
                opt.appendTo(actionSelector);
            }
        }

        var i:number = 0;
        for (var r in results) {

            var tr = $(document.createElement('tr'));
            tr.attr("machineUsageId", results[i].id);
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
            var creationTimeInMilli = results[i].startTime;
            var finishTime = creationTimeInMilli + duration * 60 * 1000; // duration -> minutes to millisec.
            var finishDate = new Date(finishTime);
            var timeString = finishDate.toLocaleTimeString();
            td_duration.text(durationString + " (" + timeString + " Uhr)");
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

    public  getSelectedMachineId():number {
        return $("#machineSelector").val();
    }

    public loadTable() {
        var machineId:number = this.getSelectedMachineId();
        if (machineId != -1) {
            this.getUsageList(machineId);
            window.history.replaceState(null, "Machine usage", "?id=" + machineId + window.location.hash);
        }
        else {
            this.usageListCallback(-1, null);
        }
    }

    public addEntry() {
        var usage:common.ToolUsage = new common.ToolUsage();

        var inputUser = $("#addEntryUser");
        var inputProj = $("#addEntryProject");
        var inputDuration = $("#addEntryDuration");

        if (inputUser.val().length == 0 || inputDuration.val().length == 0) {
            return;
        }

        var duration = parseInt(inputDuration.val()) || -1;
        if (duration > this.maxUsageTime ||
                duration <= 0 ||
                duration == NaN
        ) {
            $("#errorMessageDurationTime").show();
            return;
        }

        usage.toolId = this.getSelectedMachineId();
        usage.user = inputUser.val();
        usage.project = inputProj.val();
        usage.duration = duration;

        this.submitNewEntry(usage);
        this.cleanFieldsEntry();
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

    public deleteEntriesForTool(id:number) {
        var r:Reservation = this;
        this.client.request(
            "DELETE",
            "/toolUsage/" + id + "/",
            function (results) {
                r.deleteEntryCallback(results);
            }
        );
    }

    public deleteEntryCallback(result) {
        this.loadTable();
    }

    public moveEntry(toolId:number, usageId:number, afterId:number) {
        var r:Reservation = this;
        this.client.request(
            "POST",
            "/toolUsage/" + toolId + "/" + usageId + "/?afterId=" + afterId,
            function (results) {
                r.moveEntryCallback(results);
            },
            "{}"
        );
    }

    public setToolEnabled(toolId:number, flag:boolean) {
        var r:Reservation = this;

        this.client.request(
            "POST",
            "/toolUsage/tools/" + toolId + "/?enable=" + flag,
            function (results) {
                r.toolEnabledCallback(results);
            },
            "{}"
        );
    }

    public toolEnabledCallback(result) {
        window.location.reload();
    }

    public moveEntryCallback(result) {
        this.loadTable();
    }

    public cleanFieldsEntry(){
        $("#addEntryUser").val("");
        $("#addEntryProject").val("");
        $("#addEntryDuration").val("");
    }

    public disableAddEntry(flag:boolean) {
        $("#addEntryUser").prop("disabled", flag);
        $("#addEntryProject").prop("disabled", flag);
        $("#addEntryDuration").prop("disabled", flag);
        $("#addEntrySubmit").prop("disabled", flag);
        $("#actionSelector").prop("disabled", flag);
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

    public changeElementPosition(event, ui) {
        var elementID:number = parseInt(ui.item.attr("machineUsageId")) || -1;

        if (elementID < 0) {
            this.loadTable();
            return;
        }

        var tableBody = $( "#machineUsageTableBody" );
        var tableRows = tableBody.find("tr");

        var ancestorRow:number = - 1;
        tableRows.each(function (i, el) {
            var elem = $( el );

            if (parseInt(elem.attr("machineUsageId")) == elementID) {
                ancestorRow = i - 1;
            }
        });

        if (ancestorRow == -1) {
            this.loadTable();
            return;
        }

        var ancestorId = parseInt(tableRows[ancestorRow].getAttribute("machineUsageId")) || -1;

        this.moveEntry(this.getSelectedMachineId(), elementID, ancestorId);
    }

    public processAction() {
        var actionSelector = $("#actionSelector");
        var action:string = actionSelector.val();

        if (action == "deleteAll") {
            (<any>$("#toolUsageDeleteConfirm")).modal("show");
        } else if (action == "disableMachine") {
            this.setToolEnabled(this.getSelectedMachineId(), false);
        }
        else if (action == "enableMachine") {
            this.setToolEnabled(this.getSelectedMachineId(), true);
        }

        actionSelector.prop("selectedIndex", 0);
    }

    private findTool(id:number) : common.FabTool {
        for (var i = 0; i < this.toolArray.length; i++) {
            if (this.toolArray[i].id == id)
                return this.toolArray[i];
        }

        return null;
    }
}

$(document).ready(function () {
    reservation = new Reservation();
    reservation.disableAddEntry(true);

    var user:common.User = Authentication.getUserInfo();

    // load list of usage items on change
    $("#machineSelector").change(function () {
        reservation.loadTable();
    });

    // register callback to add new entries
    $("#addEntrySubmit").click(function () {
        reservation.addEntry();
    });

    if (user && user.hasRole(common.Roles.ADMIN)) {
        // register callback to delete all entries
        var actionSelector = $("#actionSelector");
        actionSelector.toggle(true);
        actionSelector.change(function() {
            reservation.processAction();
        });

        var actionSelectorLabel = $("#actionSelectorLabel");
        actionSelectorLabel.toggle();

        var removeEntriesSubmit = $("#toolUsageDeleteConfirmSubmit");
        removeEntriesSubmit.click(function () {
            reservation.deleteEntriesForTool(reservation.getSelectedMachineId());
        });

        // register sortable to be able to move elements
        var tableBody = $( "#machineUsageTableBody" );
        tableBody.sortable();
        tableBody.disableSelection();
        tableBody.on( "sortupdate", function(event, ui) { reservation.changeElementPosition(event, ui); } );
    }

    // set and initialise tooltip
    var tooltip:any = $("#toolUsage_tooltip");
    tooltip.prop("title", _infoResource.reservationInfo());
    tooltip.tooltip({placement: 'right'});
});