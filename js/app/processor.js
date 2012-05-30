(function() {

var Processor = {
    crop: function(img, rect, opts) {
        return $(img).pixastic("crop", rect);
    },
    flipHorizontally: function(img) {
        return $(img).pixastic("fliph");
    },
    flipVertically: function(img) {
        return $(img).pixastic("flipv");
    },
    rotate: function(img, amount) {
        return $(img).pixastic("rotate", { angle: amount });
    }
};

Object.keys(Processor).forEach(function(i) {
    Processor[i] = (function(f, i) {
        return function() {
            var result = f.apply(Processor, arguments);
            log("Processed: ", i, arguments, result);
            return result;
        };
    })(Processor[i], i);
});

window.Processor = Processor;

})();