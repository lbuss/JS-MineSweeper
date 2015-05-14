(function(){
  if (typeof($l) === "undefined") {

    window.$l = function(selector){
      window.functions = [];
      if(selector instanceof HTMLElement) {
        return new DOMNodeCollection([selector]);
      } else if(selector instanceof Function) {
        window.functions.push(selector);
      } else {
        var nodeList = document.querySelectorAll(selector);
        return new DOMNodeCollection([].slice.call(nodeList));
      }
    };

    window.onload = function() {
      window.functions.forEach(function(func) {
        func();
      });
    }
  }

  if (typeof DOMNodeCollection === "undefined") {
    window.DOMNodeCollection = function(elements){
      this.elements = elements;
    };
  }

  DOMNodeCollection.prototype.html = function(string) {
    if(string) {
      this.elements.forEach(function(element) {
        element.innerHTML = string;
      });
    } else {
      return this.elements[0].innerHTML;
    }
  }

  DOMNodeCollection.prototype.empty = function() {
    this.elements.forEach(function(element) {
      element.innerHTML = "";
    });
  }

  DOMNodeCollection.prototype.attr = function(name, value) {
    if(arguments.length > 1) {
      if(value instanceof Function){
        this.elements.forEach(function(element) {
          element.setAttribute(name, value());
        })
      } else {
        this.elements.forEach(function(element) {
          element.setAttribute(name, value);
        })
      }
    } else {
      return this.elements[0].getAttribute(name);
    }
  }

  DOMNodeCollection.prototype.addClass = function(className) {
    this.elements.forEach(function(element) {
      element.classList.add(className);
    });
  }

  DOMNodeCollection.prototype.removeClass = function(className) {
    this.elements.forEach(function(element) {
      element.classList.remove(className);
    });
  }

  DOMNodeCollection.prototype.toggleClass = function(className) {
    this.elements.forEach(function(element) {
      element.classList.toggle(className);
    });
  }

  DOMNodeCollection.prototype.appendChild = function(htmlElement) {
    this.elements.forEach(function(element) {
      element.appendChild(htmlElement);
    });
  }

  DOMNodeCollection.prototype.children = function() {
    var childrens = [];
    this.elements.forEach(function(element) {
      childrens.concat([].slice.call(element.children));
    });
    return new DOMNodeCollection(childrens);
  }

  DOMNodeCollection.prototype.parents = function() {
    var parentses = [];
    this.elements.forEach(function(element) {
      parentses.concat([].slice.call(element.parentNode));
    });
    return new DOMNodeCollection(parentses);
  }

  DOMNodeCollection.prototype.find = function(selector) {
    var items = [];
    this.elements.forEach(function(element) {
      items.concat([].slice.call(element.querySelectorAll(selector)));
    });
    return new DOMNodeCollection(itemss);
  }

  DOMNodeCollection.prototype.remove = function() {
    this.elements.forEach(function(element) {
      element.remove();
    });
  }

  DOMNodeCollection.prototype.on = function(type, func) {
    this.elements.forEach(function(element) {
      element.addEventListener(type, func);
    });
  }

  DOMNodeCollection.prototype.off = function(type, func) {
    this.elements.forEach(function(element) {
      element.removeEventListener(type, func);
    });
  }

  DOMNodeCollection.prototype.extend = function() {
    var objects = [].slice.call(arguments, 0);
    newObj = {};
    objects.forEach(function(object) {
      for(key in object) {
        newObj.key = object.key;
      }
    });
    return newObj;
  }

  DOMNodeCollection.prototype.ajax = function(options){
    var defaults = {
      method: "GET",
    }

    this.extend(defaults, options);
    return new Promise(function(resolve, reject){
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function(resp) {
         if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if(xmlhttp.status == 200){
              if(options.onSuccess){
                options.onSuccess(resp);
              }
              resolve();
            } else {
              if(options.onFailure){
                options.onFailure(resp);
              }
              reject();
            }
         }
       }
       xmlhttp.open(options.method, options.url, options.async)
       xmlhttp.send();
    })
  }
})();
