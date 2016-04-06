/*
 *  jquery-lightbox - v0.0.1
 *  Basic lightbox built off jQuery UI modal dialogs
 *  http://northrosedevs.com
 *
 *  Made by Damien Barchowsky
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

    // define your widget under a namespace of your choice
    //  with additional parameters e.g.
    // $.widget( "namespace.widgetname", (optional) - an
    // existing widget prototype to inherit from, an object
    // literal to become the widget's prototype );

    $.widget( "northrose.lightboxLink" , {

        //Options to be used as defaults
        options: {
            callbacks: {
                modalContentLoaded: null,
                openFailure: null
            },
            cssClass: "",
            dataType: "html",
            dom: {
                errorContainer: ".alert-error:first",
                modalContainer: "#globalDialog",
                modalContentContainer: "#globalDialog .dialog-content",
                modalErrorContainer: "#globalDialog .alert-error",
                modalWidget: ".ui-dialog",
                overlay: ".ui-widget-overlay"
            },
            event: "click",
            height: "auto",
            urls: {
                dialogContent: ""
            },
            width: "auto"
        },

        //Setup widget (eg. element creation, apply theming
        // , bind events etc.)
        _create: function () {
            $( this.element )
                .off( this.options.event, $.proxy( this.open, this ) )
                .on( this.options.event, $.proxy( this.open, this ) );
        },

        /**
         * Binds handlers to modal dialog elements. Invokes callbacks after
         * loading dialog content, or after dialog content failures.
         * @param response object
         * @param status string
         * @param xhr jqXHR
         */
        bindDialogHandlers: function( response, status, xhr ) {

            if ( status === "error" ) {
                /* handle ajax errors */
                this.displayError( "Error loading dialog: " + xhr.statusText );
                if ( typeof this.options.callbacks.openFailure === "function" ) {
                    this.options.callbacks.openFailure( data );
                }
                return;
            }

            /* display the dialog element */
            $( this.options.dom.modalContainer ).dialog( "open" );
            
            /* dismiss dialog by clicking on overlay */
            $( this.options.dom.overlay )
                .on( "click", $.proxy( this.close, this ) );

            /* invoke user-defined callback */
            if ( typeof this.options.callbacks.modalContentLoaded === "function" ) {
                var f = this.options.callbacks.modalContentLoaded;
                f.apply( this, Array.prototype.slice.call( arguments, 1 ) );
            }
        },

        /**
         * Closes the dialog.
         */
        close: function() {
            $( this.options.dom.modalContainer ).dialog( "close" );
        },

        /**
         * Retrieves dialog property values from element attributes.
         * @returns generic object
         */
        collectDialogProperties: function() {
            var data = {};
            data.url = $( this.element ).data( "url" );
            if ( !data.url ) {
                throw( "URL not provided." );
            }
            return data;
        },

        /**
         * Placeholder for routine definition in derived plugin, e.g. formLightboxLink
         */
        commitOperation: function() {
            throw( "commitOperation() not implemented." );
        },

        /**
         * Destroy an instantiated plugin and clean up
         * modifications the widget has made to the DOM
         */
        destroy: function () {

            // this.element.removeStuff();
            // For UI 1.8, destroy must be invoked from the
            // base widget
            $.Widget.prototype.destroy.call(this);
            // For UI 1.9, define _destroy instead and don't
            // worry about
            // calling the base widget
        },

        displayError: function( msg ) {
            var $e = $( this.options.dom.errorContainer );
            if ( $e.length === 0 ) {
                return;
            }
            $e.html( msg ).show( "slow" );
        },

        /**
         * Event handler that opens a modal dialog in response to an event.
         * @param evt
         */
        open: function( evt ) {
            evt.preventDefault();
            try {
                var p = this.collectDialogProperties();
            }
            catch ( err ) {
                this.displayError( err );
                return;
            }

            $( this.options.dom.modalContainer )
                .dialog( {
                    autoOpen: false,
                    closeOnEscape: true,
                    dialogClass: this.options.cssClass,
                    height: this.options.height,
                    modal: true,
                    title: "",
                    width: this.options.width
                } );
            $( this.options.dom.modalContentContainer )
                .load( this.options.urls.dialogContent, p.data, $.proxy( this.bindDialogHandlers, this ) );
        },

        /**
         * Respond to any changes the user makes to the
         * option method
         */
        _setOption: function ( key, value ) {
            switch (key) {
                case "someValue":
                    //this.options.someValue = doSomethingWith( value );
                    break;
                default:
                    //this.options[ key ] = value;
                    break;
            }

            // For UI 1.8, _setOption must be manually invoked
            // from the base widget
            $.Widget.prototype._setOption.apply( this, arguments );
            // For UI 1.9 the _super method can be used instead
            // this._super( "_setOption", key, value );
        }
    });

})( jQuery, window, document );

/*
 *  jquery-lightbox - v0.0.1
 *  Basic lightbox built off jQuery UI modal dialogs
 *  http://northrosedevs.com
 *
 *  Made by Damien Barchowsky
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

    $.widget( "northrose.imageLightboxLink" , $.northrose.lightboxLink, {

        /**
         * Widget properties.
         */
        options: {
            dataType: "html",
            cssClass: "lightbox-image",
            urls: {
                dialogContent: "/ajax/lightbox-image"
            }
        },

        bindDialogHandlers: function( response, status, xhr ) {
            this._super();

            /* center the dialog after images have been loaded */
            $( this.options.dom.modalContentContainer + " img" )
                .off( "load", $.proxy(this.centerDialog, this ) )
                .on( "load", $.proxy(this.centerDialog, this ) );

            /* dismiss dialog by clicking on images */
            $( this.options.dom.modalContentContainer + " img" )
                .off( "load", $.proxy(this.centerDialog, this ) )
                .on( "click", $.proxy( this.close, this ) );
        },
        
        centerDialog: function() {
            $( this.options.dom.modalWidget )
                .position( {
                    my: "center",
                    at: "center",
                    of: $( this.options.dom.overlay )
                } );
        },
        
        /**
         * Retrieves dialog property values from element attributes.
         * @returns {{src: *, alt: *}}
         */
        collectDialogProperties: function() {
            var data = {
                src: $( this.element ).data( "src" ),
                alt: $( this.element ).data( "alt" )
            };
            if ( !data.src ) {
                throw( "Image not provided." );
            }
            return data;
        }
    });

})( jQuery, window, document );

/*
 *  jquery-lightbox - v0.0.1
 *  Basic lightbox built off jQuery UI modal dialogs
 *  http://northrosedevs.com
 *
 *  Made by Damien Barchowsky
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

    // define your widget under a namespace of your choice
    //  with additional parameters e.g.
    // $.widget( "namespace.widgetname", (optional) - an
    // existing widget prototype to inherit from, an object
    // literal to become the widget's prototype );

    $.widget( "northrose.formLightboxLink" , $.northrose.lightboxLink, {

        options: {
            dataType: "html",
            dom: {
                cancelButton: ".dlg-cancel-btn",
                datePicker: ".datepicker",
                submitButton: "dlg-commit-btn"
            }
        },
        
        bindDialogHandlers: function( response, status, xhr ) {
            this._super();

            /* datepicker widgets */
            $( this.options.dom.datePicker, $( this.element ) ).datepicker();

            /* form buttons */
            $( this.options.dom.submitButton, $( this.element ) )
                .button()
                .on( "click", $.proxy( this.commitOperation, this ) );
            $( this.options.dom.cancelButton, $( this.element ) )
                .button()
                .on( "click", $.proxy( this.close, this ) );
        }
    });

})( jQuery, window, document );

/*
 *  jquery-lightbox - v0.0.1
 *  Basic lightbox built off jQuery UI modal dialogs
 *  http://northrosedevs.com
 *
 *  Made by Damien Barchowsky
 *  Under MIT License
 */
;( function( $, window, document, undefined ) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "lightbox",
        defaults = {
            callbacks: {
                modalContentLoaded: null,
                openFailure: null
            },
            cssClass: "",
            dataType: "html",
            dialogType: "",
            dom: {
                cancelButton: ".dlg-cancel-btn",
                datePicker: ".datepicker",
                errorContainer: ".alert-error",
                modalContainer: "#globalDialog",
                modalContentContainer: "#globalDialog .dialog-content",
                modalErrorContainer: "#globalDialog .alert-error",
                modalWidget: ".ui-dialog",
                overlay: ".ui-widget-overlay",
                submitButton: "dlg-commit-btn"
            },
            event: "click",
            height: "auto",
            urls: {
                imageDialog: "/ajax/lightbox-image.php"
            },
            width: "auto"
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( true, {}, defaults, options || {} );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend( Plugin.prototype, {

        /**
         * Binds handlers to modal dialog elements. Invokes callbacks after
         * loading dialog content, or after dialog content failures.
         * @param response object
         * @param status string
         * @param xhr jqXHR
         */
        bindDialogHandlers: function( response, status, xhr ) {

            var e = this;
            if ( status === "error" ) {
                /* handle ajax errors */
                this.displayError( "Error loading dialog: " + xhr.statusText );
                if ( typeof e.settings.callbacks.openFailure === "function" ) {
                    e.settings.callbacks.openFailure( data );
                }
                return;
            }

            /* display the dialog element */
            $( this.settings.dom.modalContainer ).dialog( "open" );

            /* center the dialog after images have been loaded */
            $( this.settings.dom.modalContentContainer + " img" )
                .on( "load", function() {
                    $( e.settings.dom.modalWidget )
                        .position( {
                            my: "center",
                            at: "center",
                            of: $( e.settings.dom.overlay )
                        } );
                } );

            /* datepicker widgets */
            $( this.settings.dom.datePicker, $( this.element ) ).datepicker();

            /* form buttons */
            $( this.settings.dom.submitButton, $( this.element ) )
                .button()
                .on( "click", $.proxy( this.commitOperation, this ) );
            $( this.settings.dom.cancelButton, $( this.element ) )
                .button()
                .on( "click", $.proxy( this.close, this ) );

            /* dismiss dialog by clicking on overlay */
            $( this.settings.dom.overlay )
                .on( "click", $.proxy( this.close, this ) );

            /* dismiss dialog by clicking on images */
            switch ( this.settings.dialogType ) {
                case "image":
                    $( this.settings.dom.modalContentContainer + " img" )
                        .on( "click", $.proxy( this.close, this ) );
                    break;
                default:
                    /* nothing required */
            }

            /* invoke user-defined callback */
            if ( typeof e.settings.callbacks.modalContentLoaded === "function" ) {
                var f = e.settings.callbacks.modalContentLoaded;
                f.apply( e, Array.prototype.slice.call( arguments, 1 ) );
            }
        },

        close: function() {
            $( this.settings.dom.modalContainer ).dialog( "close" );
        },

        collectDialogProperties: function() {
            var data = {};
            data.url = $( this.element ).data( "url" );
            if ( !data.url ) {
                throw( "URL not provided." );
            }
            return data;
        },

        collectImageDialogProperties: function() {
            var data = {
                url: this.settings.urls.imageDialog,
                data: {}
            };
            data.data.src = $( this.element ).data( "src" );
            data.data.alt = $( this.element ).data( "alt" );
            if ( !data.data.src ) {
                throw( "Image not provided." );
            }
            return data;
        },

        commitOperation: function() {
            throw( "commitOperaiton() not implemented." );
        },

        displayError: function( msg ) {
            var $e = $( this.settings.dom.errorContainer );
            if ( $e.length === 0 ) {
                return;
            }
            $e.html( msg ).show( "slow" );
        },

        init: function() {

            $( this.element )
                .off( this.settings.event, $.proxy( this.open, this ) )
                .on( this.settings.event, $.proxy( this.open, this ) );
        },

        /**
         * Event handler that opens a modal dialog in response to an event.
         * @param evt
         */
        open: function( evt ) {
            evt.preventDefault();
            try {
                var p;
                switch ( this.settings.dialogType ) {
                    case "image":
                        p = this.collectImageDialogProperties();
                        break;
                    default:
                        p = this.collectDialogProperties();
                }
            }
            catch ( err ) {
                this.displayError( err );
                return;
            }

            $( this.settings.dom.modalContainer )
                .dialog( {
                    autoOpen: false,
                    closeOnEscape: true,
                    dialogClass: this.settings.cssClass,
                    height: this.settings.height,
                    modal: true,
                    position: {
                        my: "center",
                        at: "center",
                        of: window
                    },
                    title: "",
                    width: this.settings.width
                } );
            $( this.settings.dom.modalContentContainer )
                .load( p.url, p.data, $.proxy( this.bindDialogHandlers, this ) );
        }
    } );

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function( options ) {
        return this.each( function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" +
                    pluginName, new Plugin( this, options ) );
            }
        } );
    };

} )( jQuery, window, document );
