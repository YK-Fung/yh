define(['jquery', 'datetime', 'table', 'table-tool', 'table-export', 'tableExport', 'zh'], function($){

    // 日期控件
    $('.date-time').datetimepicker({
        minView: "month",
        timepicker:false,
        format:'Y/m/d',
        formatDate:'Y/m/d'
    });


});