var through     = require('through2'),
    rework      = require('rework');

classPrefix = function (prefix) {
  return function classPrefix(styling) {
    var walk = require('rework-walk');
    var tags = '. # [ : input button select textarea'.split(' ');

    checkTags = function( selector ){

      for(var i=0; i<=tags.length; i++){
        if( selector.indexOf(tags[i]) === 0 ){
          return 0;
        }
      }
      return -1;
    }

    walk(styling, function(rule, node) {
      if (!rule.selectors) return rule;

      rule.selectors = rule.selectors.map(function(selector) {


        if (checkTags(selector) === 0) {
          //return selector.split('.').join('.' + prefix);
          return prefix + selector;
        } else if (selector.indexOf('body') === 0 || selector.indexOf('html') === 0) {
          //return selector.split('.').join('.' + prefix);
          var parts = selector.split(/ (.+)?/);
          var new_selector = parts[0] + prefix;

          if ( parts[1] ){
            new_selector += parts[1];
          }

          return new_selector;

        } else if (selector.indexOf('body') === 0 || selector.indexOf('html') === 0) {

        } else {
          return selector;
        }
      });
    });
  };
};

module.exports = function(prefix) {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (!file.isBuffer()) {
      cb();
    }

    var src = file.contents.toString();
    var css = rework(src, { source: file.path })
                .use(classPrefix(prefix)).toString({ sourcemap: true });

    file.contents = new Buffer(css);
    cb(null, file);
  });
};
