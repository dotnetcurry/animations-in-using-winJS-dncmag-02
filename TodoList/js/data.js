(function () {
    "use strict";

    var appData = Windows.Storage.ApplicationData.current

    var todos = [];

    todos.push({ title: "Buy surface tablet" });
    todos.push({ title: "Buy milk" });

    if (!appData.localSettings.values.todos) {
        appData.localSettings.values.todos = JSON.stringify(todos);
    }
    
    todos = JSON.parse(appData.localSettings.values.todos);
 
    function insertAtTop(item) {
        if (item.title != null) {
            todos = JSON.parse(appData.localSettings.values.todos);
            todos.splice(0, 0, item);

            appData.localSettings.values.todos = JSON.stringify(todos);

            data.items.splice(0, 0, item);
        }
    }

    WinJS.Namespace.define("data", { 
        items: new WinJS.Binding.List(todos), insertAtTop: insertAtTop 
    });

})();