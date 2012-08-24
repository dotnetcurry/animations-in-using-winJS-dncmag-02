(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var gestureRecognizer = new Windows.UI.Input.GestureRecognizer();
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var lastElement;
    var currentIndex = 0;

    ui.Pages.define("/todo.html", {

        ready: function (element, options) {
            element.querySelector(".todo-text").addEventListener("keypress", function(e){
                if (e.keyCode == 13) {
                    data.insertAtTop({ title: this.value });
                    addNewTodo(this.value, true);
                    this.value = "";
                }
            });

            data.items.forEach(function (item) { addNewTodo(item.title); });

            gestureRecognizer.gestureSettings = Windows.UI.Input.GestureSettings.crossSlide;
            gestureRecognizer.crossSlideHorizontally = true;
        
            var manupulationStarted = false;

            gestureRecognizer.oncrosssliding = function (e) {
                deleteTodo(lastElement);
            };

            var itemsToGestureTrack = document.querySelectorAll(".item-container");

            for (var index = 0; index < itemsToGestureTrack.length; index++) {
                prepareElementForGesture(itemsToGestureTrack[index]);
            }
        }
    });

    function prepareElementForGesture(element) {
        element.addEventListener("MSPointerDown", processDownEvent, false);
        element.addEventListener("MSPointerMove", processMoveEvent, false);
        element.addEventListener("MSPointerUp", processUpEvent, false);
        element.addEventListener("MSPointerCancel", processDownEvent, false);
    }

    function processDownEvent(e) {
        lastElement = e.currentTarget;
        gestureRecognizer.completeGesture();
        gestureRecognizer.processDownEvent(e.currentPoint);
    }

    function processMoveEvent(e) {
        lastElement = e.currentTarget;
        gestureRecognizer.processMoveEvents(e.getIntermediatePoints(e.currentTarget));
    }

    function processUpEvent(e) {
        lastElement = e.currentTarget;
        gestureRecognizer.processUpEvent(e.currentPoint);
    }

    function deleteTodo(deletedItem) {
        var allItems = document.querySelectorAll(".item-container:not([deleting])");

        deletedItem.setAttribute("deleting", true);

        --currentIndex;

        var affectedItems = document.querySelectorAll(".listItem:not([deleting])");

        // Create deleteFromList animation.
        var deleteFromList = WinJS.UI.Animation.createDeleteFromListAnimation(deletedItem, affectedItems);

        // Take deletedItem out of the regular document layout flow so remaining list items will change position in response.
        deletedItem.style.position = "fixed";
        deletedItem.style.background = "transparent";
        deletedItem.style.transform = "translate(100px, 0px)";

        deletedItem.style.opacity = 0;

        deleteFromList.execute();
    }

    function addNewTodo(todo, prepend) {
        var affectedItems = document.querySelectorAll(".item-container");

        var newItem = document.createElement("div");

        newItem.className = "item-container";
       
        var titleElement = document.createElement("h4");

        titleElement.className = "item-title";
        titleElement.innerHTML = todo;

        newItem.appendChild(titleElement);
        newItem.style.background = listColor();

        ++currentIndex;

        prepareElementForGesture(newItem);

        var addToList = WinJS.UI.Animation.createAddToListAnimation(newItem, affectedItems);

        if (todoList.childElementCount > 0) {
       
            if (prepend)
                todoList.insertBefore(newItem, todoList.childNodes[0]);
            else
                todoList.appendChild(newItem);
        }
        else {
            todoList.appendChild(newItem);
        }
        
        addToList.execute();
    }

    function listColor() {
        return "rgb(255," + (216 - (currentIndex * 10)) + ",0)";
    }

    function onCrossSliding(e) {
        if (e.holdingState === Windows.UI.Input.HoldingState.started) {
            var target = e.target;
        }
    }

})();