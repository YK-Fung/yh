requirejs.config({
  baseUrl: '../../js',
  paths: {
    'jquery': 'jquery-1.11.2',
    'bootstrap': 'bootstrap.min',
    'datetime': 'jquery.datetimepicker.full',
    'migrate': 'jquery-migrate',
    'print': 'jquery.jqprint',
    'table': 'bootstrap-table',
    'table-tool': 'bootstrap-table-toolbar',
    'zh':'bootstrap-table-zh-CN.min',
    'tableExport':'tableExport',
    'table-export':'bootstrap-table-export',
    'ue-config':'ueditor.config',
    'ue-all':'ueditor.all',
    'ZeroClipboard': "third-party/ZeroClipboard/ZeroClipboard",
    'move':'move-el'
  },
  shim : {
    'bootstrap': {
      deps: ['jquery']
    },
    'datetime': {
      deps: ['jquery']
    },
    'migrate': {
      deps: ['jquery']
    },
    'print': {
      deps: ['jquery']
    },
    'table': {
      deps: ['bootstrap']
    },
    'table-tool': {
      deps: ['table']
    },
    'table-export': {
      deps: ['table']
    },
    'tableExport': {
      deps: ['table']
    },
    'zh': {
      deps: ['table']
    },
    'ue-config': {
      deps: ['jquery']
    },
    'ue-all': {
      deps: ['ue-config']
    }
  }
});
//主入口
require(['jquery', 'bootstrap'], function ($) {
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?bc4ad732a2c689e06249659dd5f5c934";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  })();

  $(document).on('click', function () {
      //$(parent.document).find('.tab .select-list').hide();
  });
});