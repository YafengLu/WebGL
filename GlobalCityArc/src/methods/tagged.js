
export function tagged(name, value) {
  if (arguments.length < 2) {

    if (typeof name === "string") {
      var node = this.node();
      var n = (name = selection_tags(name)).length;
      var i = -1;

      if (value = node.__tags__.length) {
        while (++i < n) {
          if (value.indexOf(name[i]) === -1) {
             return false;
          }
        }
      }

      return true;
    }

    for (value in name) {
      this.each(selection_tagged(value, name[value]));
    }

    return this;
  }

  return this.each(selection_tagged(name, value));
}


function selection_tags(name) {
  return (name + "").trim().split(/^|\s+/);
}

function selection_tagged(name, value) {
  name = selection_tags(name)
    .map(selection_taggedName);

  var n = name.length;

  function taggedConstant() {
    var i = -1;
    while (++i < n) {
      name[i](this, value);
    }
  }

  function taggedFunction() {
    var i = -1, x = value.apply(this, arguments);
    while (++i < n) {
      name[i](this, x);
    }
  }

  return typeof value === "function" ?
    taggedFunction: 
    taggedConstant;
}

function selection_taggedName(name) {
  return function(node, value) {
    var index;

    if (node.__tags__) {
      index = node.__tags__.indexOf(name);
      if (value && index === -1) {
        return node.__tags__.push(name);
      } else if (index !== -1){
        return delete node.__tags__[index];
      }
    }

    return;
  };
}