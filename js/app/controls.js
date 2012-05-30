(function() {

var Control = (function() {
    return {
        init: function() {
        },
        enable: function() {
        },
        apply: function() {
        },
        cancel: function() {
        },
        disable: function() {
        }
    };
})();

var Resize = (function() {

    function setDOM() {

    }

    var Model = {
        usePercentages: true,
        keepProportions: true,
        x: 100,
        y: 100,
        set: function() {
            View.refresh();
        }
    };

    var View = {
        init: function() {
            var domPercentages = this.domPercentages = $('#resize-percentages');
            this.domProportions = $('#resize-proportions');
            this.domX = $('#resize-x');
            this.domY = $('#resize-y');

            $("#control-resize").on("change", function() {
                Model.usePercentages = domPercentages.checked();
                Model.usePercentages = domPercentages.checked();
            });
            $("#control-resize").on("input", function() {

            });
        }
    };

    return {
        init: function() {
            View.init();
        },
        enable: function() {

        },
        apply: function() {
        },
        cancel: function() {
        },
        disable: function() {
        }
    };
})();

var Rotate = (function() {
    return {
        init: function() {
        },
        enable: function() {
        },
        apply: function(img, opts) {
            log("HERE", opts);

            var result;
            if (opts === "flipv") {
                result = Processor.flipHorizontally(img);
            }
            else if (opts === "fliph") {
                result = Processor.flipVertically(img);
            }
            else if (opts === "rotateRight") {
                result = Processor.rotate(img, -90);
            }
            else if (opts === "rotateLeft") {
                result = Processor.rotate(img, 90);
            }

            log(result, img);
            return result;
        },
        cancel: function() {
        },
        disable: function() {
        }
    };
})();

var Crop = (function() {

    var jcrop_api;
    var coords;
    function saveCoords(c) {
        coords = c;

        /*

        jQuery('#x1').val(c.x);
        jQuery('#y1').val(c.y);
        jQuery('#x2').val(c.x2);
        jQuery('#y2').val(c.y2);
        jQuery('#w').val(c.w);
        jQuery('#h').val(c.h);

        */
    }

    return {
        init: function() {
        },
        enable: function() {

            coords = null;
            jcrop_api = null;

            var img = $(".edit-img");
            if (img.is("canvas")) {
                img.replaceWith("<img class='edit-img real' src='"+img[0].toDataURL()+"' />");
                img = $(".edit-img.real");
            }

            //log(img[0].width, img[0].height);

            img.Jcrop({
                onChange: saveCoords,
                onSelect: saveCoords,
                setSelect: [img[0].width / 4, img[0].height / 4, img[0].width - (img[0].width / 4), img[0].height - (img[0].height / 4)]
            }, function(){

              jcrop_api = this;

            }).addClass("real");
        },
        apply: function() {

            var img = $(".edit-img.real")[0];
            var result;

            this.disable();

            if (jcrop_api && coords) {
                var rect = {
                    left : coords.x, top : coords.y, width : coords.w, height : coords.h
                };
                window.RECT = rect;
                result = Processor.crop(img, rect);
            }

            return !!result;
        },
        cancel: function() {
            this.disable();
            coords = null;
            jcrop_api = null;
        },
        disable: function() {
            if (jcrop_api) {
                jcrop_api.release();
                jcrop_api.disable();
                jcrop_api.destroy();
                $(".edit-img.real").attr("style", "");
            }
        }
    };
})();


var Controls = window.Controls = {
    Resize: Resize,
    Crop: Crop,
    Rotate: Rotate
};

})();


