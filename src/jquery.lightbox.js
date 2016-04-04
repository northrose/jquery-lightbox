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
                openFailure: null,
                openSuccess: null
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

        bindDialogHandlers: function() {
            var e = this;
            $( this.settings.dom.datePicker, $( this.element ) ).datepicker();
            $( this.settings.dom.submitButton, $( this.element ) )
                .button()
                .on( "click", this.commitOperation );
            $( this.settings.dom.cancelButton, $( this.element ) )
                .button()
                .on( "click", function( evt ) {
                    evt.preventDefault();
                    $( e.settings.dom.modalContainer ).lightbox( "close" );
                } );
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

        display: function( data ) {
            var e = this;
            $( this.settings.dom.modalContentContainer ).html( data );
            $( this.settings.dom.modalContainer ).dialog( {
                title: data.label,
                minWidth: 360,
                width: this.settings.width,
                height: this.settings.height,
                dialogClass: this.settings.cssClass,
                closeOnEscape: true,
                modal: true,
                open: function( event, ui ) {
                    $( ".ui-widget-overlay" ).on( "click", function( evt ) {
                        evt.preventDefault();
                        e.close();
                    } );

                    e.bindDialogHandlers();

                    if ( typeof e.settings.callbacks.modalContentLoaded === "function" ) {
                        var f = e.settings.callbacks.modalContentLoaded;
                        f.apply( e, Array.prototype.slice.call( arguments, 1 ) );
                    }
                }
            } );
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

            var e = this;

            // fetch content
            $.ajax( {
                    method: "POST",
                    url: p.url,
                    data: p.data
                } )
                .done( function( data ) {

                    e.display( data );
                    if ( typeof e.settings.callbacks.openSuccess === "function" ) {
                        e.settings.callbacks.openSuccess( data );
                    }
                } )
                .fail( function( xhr, status ) {
                    e.displayError( status );
                    if ( typeof e.settings.callbacks.openFailure === "function" ) {
                        e.settings.callbacks.openFailure( data );
                    }
                } );
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
