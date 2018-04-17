requirejs.config({
  baseUrl: '../../js',
  paths: {
    'jquery': 'jquery-1.11.2',
    'datetime': 'jquery.datetimepicker.full',
    'echarts': 'echarts.min',
    'china': 'echarts-china',
    'table': 'tableExport',
    'base64': 'mybase64',
    'verify': 'verify',
    'pagination': 'pagination',
    'popwin': 'popwin',
    'ue': 'ueditor.config',
    'ue-all': 'ueditor.all.min',
    'ZeroClipboard': "third-party/ZeroClipboard/ZeroClipboard"
  },
  shim : {
    'datetime' : {
      deps : ['jquery']
    },
    'echarts' : {
      deps : ['jquery']
    },
    'china' : {
      deps : ['echarts']
    },
    'table' : {
      deps : ['jquery']
    },
    'base64' : {
      deps : ['jquery']
    },
    'verify' : {
      deps : ['jquery']
    },
    'pagination' : {
      deps : ['jquery']
    },
    'popwin' : {
      deps : ['jquery']
    },
    'ue': {
      deps: ['jquery']
    },
    'ue-all': {
      deps: ['ue']
    }
  }
});
//主入口
require(['jquery']);