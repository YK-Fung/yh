/**
 * @author: aperez <aperez@datadec.es>
 * @version: v2.0.0
 *
 * @update Dennis Hernández <http://djhvscf.github.io/Blog>
 */

!function($) {
    'use strict';

    var timeoutId=0;

    var search = function(that) {
            $(document).on('change input', '.form-inline select,.form-inline input', function (event) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function () {
                    that.options.pageNumber = 1;
                    that.onSearch(event);
                }, that.options.searchTimeOut);
            });
    };


    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initToolbar = BootstrapTable.prototype.initToolbar;

    BootstrapTable.prototype.initToolbar = function() {
        _initToolbar.apply(this, Array.prototype.slice.apply(arguments));
        //如果该table不开启搜索，则直接返回
        if (!this.options.search) {
            return;
        }
        //如果该table不开启高级搜索，则直接返回
        if (!this.options.advancedSearch) {
            return;
        }
        search(this);
    };

}(jQuery);
