test("Local config",function(){
  var testConfig = {a : Math.floor(Math.random()*100),b : Math.floor(Math.random()*100)};
  CommonController.localConfig =  testConfig;
  CommonController.setLocalConfig("__test__");
  var test1 = localStorage.__test__;
  ok(test1 == testConfig.toSource(),"save local strage");
  CommonController.localConfig = "";
  CommonController.getLocalConfig("__test__");
  var test2 = localStorage.__test__;
  ok(test2 == testConfig.toSource(),"save local strage");
});
