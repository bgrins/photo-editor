

$("#debug").click(function() {
    $(this).toggleClass("active");
    return false;
});

var SamplePhotos = [
    "photos/Chrysanthemum.jpg", "photos/Desert.jpg", "photos/Hydrangeas.jpg",
    "photos/Jellyfish.jpg", "photos/Koala.jpg", "photos/Lighthouse.jpg",
    "photos/Penguins.jpg", "photos/Tulips.jpg"
];

var CanvasState = {
    set: function(id) {

    },
    get: function(id) {

    }
};

var Layers = (function() {

    var layerid = 0;
    var layers = [];
    var active = -1;
    var activeDOM = $([]);
    var undoableCanvas = $([]);

    return {
        init: function() {
            Layers.container = $("#layer-tabs");
            Layers.container.on("click", ".btn", function() {
                Layers.setActive($(this).data("layerid"));
                return false;
            });
            Layers.container.on("click", ".btn em", function() {
                Layers.remove($(this).closest(".btn").data("layerid"));
                return false;
            });
        },
        add: function(img, name) {

            var id = layers.push(img) - 1;

            var can = document.createElement("canvas");
            var ctx = can.getContext('2d');
            can.width = img.width;
            can.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            $(can).addClass("edit-img");


            name = name || "Image " + (id + 1);
            var btn = $('<a class="btn"  data-toggle="button"  data-layerid="'+id+'">'+name+'<em><i class="icon-remove"></i></em></a>');
            Layers.container.append(btn);


            var newLayer = $("<div class='layer' data-layerid='"+id+"'></div>");
            newLayer.append(can);
            App.imgContainer.append(newLayer);

            return id;
        },
        setActive: function(id) {

            if (!layers[id]) {
                id = -1;
            }

            $("[data-layerid]").removeClass("active");
            activeDOM = $("[data-layerid="+id+"]").addClass("active");

            // Set up 'undo' point in case they press cancel after a number of modification
            var initialCanvas = Layers.getActiveCanvas();
            if (initialCanvas.length) {
                undoableCanvas = initialCanvas.clone();
            }
            else {
                undoableCanvas = $([]);
            }

            App.setEditing(id !== -1);

            if (active !== id) {
                ControlsView.close();
            }

            active = id;

            Zoom.Preview.setBackground(layers[id]);

        },
        revert: function() {
            Layers.getActiveCanvas().replaceWith(undoableCanvas);
        },
        getActiveCanvas: function() {
            return activeDOM.find(".edit-img");
        },
        getActive: function()  {
            return active;
        },
        remove: function(id) {
            $("[data-layerid="+id+"]").remove();

            layers[id] = null;
            Layers.setActive(active);
        }
    };
})();

var ControlsView = (function() {

    var accordion;

    return {
        init: function() {

            accordion = $("#accordion-controls");

            accordion.on("click", ".btn-apply", function() {

                if (App.activeControl) {
                    var img = Layers.getActiveCanvas()[0];
                    App.activeControl.apply(img, $(this).data("action"));
                }

                //accordion.collapse('hide');

                return false;
            });

            accordion.on("click", ".btn-cancel", function() {
                ControlsView.close();
                Layers.revert();
                return false;
            });

            accordion.on("click", ".btn.disabled", false);

            accordion.on("hide", function(e) {
                log("HIDE", App.activeControl);
                if (App.activeControl) {
                    App.activeControl.disable();
                }
                /*if (activeControl) {
                    var img = $(".edit-img")[0];
                    activeControl.cancel(img);
                }*/


                //if (activeControl) {
                //    activeControl.disable();
                //}
            });

            accordion.on("show", function(e) {

                //if (activeControl) {
                //    activeControl.disable();
                //}

                log("SHOW", this, e.target.id);
                App.setActiveControl(e.target.id);

            });
        },
        close: function() {
            accordion.find(".collapse").removeClass("in").attr("style", "");
            // accordion.collapse("hide"); opens all fields the first time for some reason
        },
        setEnabled: function(isEnabled) {

            accordion.find(".accordion-toggle").toggleClass("disabled", !isEnabled);

            if (!isEnabled) {
                ControlsView.close();
            }
        }
    };
})();

var App = {
    init: function() {

        if (!App.compatible()) {
            $("body").addClass("no-compat");
            return;
        }


        App.body = $("body");
        App.document = document;
        App.imgContainer = $("#app-img");

        Layers.init();
        ControlsView.init();

        var opts = {
            on: {
                load: function(e, file) {
                    if (file.type.match(/image/)) {
                        App.loadImage(e.target.result);
                    }
                },
                skip: function() {

                },
                error: function(e, file) {
                    App.body.addClass("error");
                }
            }
        };



        var samples= $("#sample-photos");
        samples.html(SamplePhotos.map(function(photo) {
            return "<li data-name='"+photo+"'><img src='" + photo + "' /></li>";
        }).join(''));

        samples.on("click", "li", function() {
            App.loadImage($(this).find("img").attr("src"));
            return false;
        });

        FileReaderJS.setupDrop(App.body[0], opts);
        FileReaderJS.setupInput($('#pick-file')[0], opts);
        FileReaderJS.setupClipboard(document.body, opts);


        Zoom.init();

        // $("#app-scroller").scroll(function() {
        //     Zoom.Preview.refresh();
        // });

        $(window).resize(function() {
            Zoom.Preview.refresh();
        });

        $('body').tooltip({
          selector: "a[rel=tooltip]"
        });

        App.loadImage(SamplePhotos[1], true);
        Layers.setActive(-1);
    },
    setEditing: function(isEditing) {
        isEditing = !!isEditing;

        App.body.toggleClass("editing", isEditing);
        App.isEditing = isEditing;
        ControlsView.setEnabled(isEditing);
        Zoom.Preview.refresh();
    },
    compatible: function() {
        return !!document.createElement("canvas").getContext("2d");
    },
    setActiveControl: function(id) {

        if (!App.isEditing) {
            return;
        }

        if (id === "control-crop") {
            Controls.Crop.enable();
            App.activeControl = Controls.Crop;
        }
        else if (id === "control-rotate") {
            Controls.Rotate.enable();
            App.activeControl = Controls.Rotate;
        }
        else {
            App.activeControl = null;
        }
    },
    addNewLayer: function(img) {
        return Layers.add(img);
    },
    loadImage: function(url, loadInBackground) {
        App.body.addClass("loading");
        var img = new Image();
        img.onload = function() {
            App.body.removeClass("loading");
            var id = App.addNewLayer(img);
            if (!loadInBackground) {
                Layers.setActive(id);
            }
        };
        img.src = url;
    },
    getImage: function() {
        return $("#app-img");
    },
    resize: function() {

    }
};

var Zoom = {
    _el: null,
    container: $([]),
    Preview: {
        handle: $([]),
        el: $([]),
        imgContainer: $([]),
        refresh: function() {
            var canvas = Layers.getActiveCanvas();
            if (!canvas || !canvas.length) {
                return;
            }

            var scroller = $("#app-scroller");
            var scrollerHeight = scroller.height();
            var scrollerWidth = scroller.width();
            var heightRatio = (canvas.height() / scrollerHeight) * Zoom.get();
            var widthRatio = (canvas.width() / scrollerWidth) * Zoom.get();

            var boxWidth = Zoom.Preview.el.width();
            var boxHeight = Zoom.Preview.el.height();
            var scrollTop = scroller.scrollTop() / scrollerHeight;
            var scrollLeft = scroller.scrollLeft() / scrollerWidth;

            var imgWidth = Zoom.Preview.imgContainer.width();
            var imgHeight = Zoom.Preview.imgContainer.height();

            Zoom.container.toggleClass("show-preview", widthRatio > 1 || heightRatio > 1);
            //Zoom.container.addClass("show-preview");

            Zoom.Preview.handle.width(boxWidth / widthRatio).height(boxHeight / heightRatio).css({
                top: (scrollTop * imgWidth) + "px",
                left: (scrollLeft * imgHeight) + "px"
            });
        },
        setBackground: function(img) {
            Zoom.Preview.el.find("img").remove();
            if (img) {
                Zoom.Preview.el.find(".img").append(img);
            }
            Zoom.Preview.refresh();
        }
    },
    MAX_ZOOM: 4,
    MIN_ZOOM: 0.1,

    init: function() {
        Zoom._el = $("#zoom");
        Zoom._el.slider({
            min: Zoom.MIN_ZOOM * 100,
            max: Zoom.MAX_ZOOM * 100,
            slide: function() {
                Zoom.set(Zoom.get());
            }
        });

        Zoom.Preview.el = $("#zoom-preview");
        Zoom.Preview.imgContainer = $("#zoom-preview .img");
        Zoom.Preview.handle = $("#zoom-preview-handle");

        Zoom.Preview.handle.draggable({
            containment: "parent",
            scroll: false,
            drag: function(e, ui) {
                var scroller = $("#app-scroller");
                var leftPercentage = $(this).position().left / $(this).parent().width();
                var topPercentage = $(this).position().top / $(this).parent().height();

                scroller.scrollTop(scroller.height() * topPercentage);
                scroller.scrollLeft(scroller.width() * leftPercentage);
            }
        });

        Zoom.container = $("#zoom-container");

        Zoom.container.button().on("click", ".btn", function() {
            if ($("#zoomFit").hasClass("active")) {
                Zoom.set(1);
            }
            else {
                Zoom.set("fit");
            }
        });

        Zoom.set(Zoom.readFromDoc());
        /*
        Zoom._el.attr("max", Zoom.MAX_ZOOM * 100);
        Zoom._el.attr("min", Zoom.MIN_ZOOM * 100);*/

    },
    set: function(z) {
        var num;

        if (z === "fit") {
            $("body").addClass("fit");
            Zoom._el.slider("disable");
            num = 1;
        }
        else {
            num = Math.min(Zoom.MAX_ZOOM, Math.max(Zoom.MIN_ZOOM, z));
            Zoom._el.slider("enable");
            $("body").removeClass("fit");
        }

        // TODO: recenter scrolling content after a zoom.

        App.getImage().css("zoom", num);
        Zoom._el.slider("value", num * 100);
        Zoom.Preview.refresh();

        App.resize();
    },
    readFromDoc: function() {
        return parseFloat(App.getImage().css("zoom") || 1);
    },
    get: function() {
        return Zoom._el.slider("value")  / 100;
    },
    reset: function() {
        Zoom.set(1);
    },
    bumpUp: function() {
        Zoom.set (Zoom.get()+ 0.5);
        return false;
    },
    bumpDown: function() {
        Zoom.set (Zoom.get() - 0.5);
        return false;
    }
};


$(App.init);
