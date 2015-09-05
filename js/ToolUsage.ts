/// <reference path="libraries/jquery.d.ts" />
/// <reference path="util/RestClient.ts"/>
/// <reference path="common/model/FabTool.ts" />
/// <reference path="common/model/ToolUsage.ts" />

var reservation : Reservation = null;

class Reservation {
    toolArray : Array<common.FabTool>;
    client : RestClient = null;

    constructor () {
        this.client = new RestClient();

        this.updateToolList();
    }

    updateToolList() {
        var r : Reservation = this;
        this.client.requestGET("/drupal/tools", function(result) { r.toolListCallback(result)});
    }

    toolListCallback(list) {
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

    getUsageList( machineId : number ) {
        var r : Reservation = this;
        this.client.requestGET("/toolUsage/" + machineId + "/", function(result){r.usageListCallback(machineId, result)});
    }

    usageListCallback(machineId : number, results : common.ToolUsage) {
        var table = $('#machineUsageTable');
        var i : number = 0;
        for (var r in results) {

            var tr = $(document.createElement('tr'));
            var td_nr = $(document.createElement('td'));
            td_nr.text((i+1).toString());
            td_nr.appendTo(tr);

            var td_user = $(document.createElement('td'));
            td_user.text(results[i].user);
            td_user.appendTo(tr);

            var td_duration = $(document.createElement('td'));
            td_duration.text(results[i].duration);
            td_duration.appendTo(tr);

            tr.appendTo(table);
            i++;
        }
    }

    loadTable() {
        var machineId = $("#machineSelector").val();
        if (machineId != -1)
            this.getUsageList(machineId);
    }
}


$(document).ready(function () {
    reservation = new Reservation();
    $("#machineSelector").change(function(){ reservation.loadTable(); })
});