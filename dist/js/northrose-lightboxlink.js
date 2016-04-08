/*
 *  lightboxLink - v0.1.0
 *  Attach behaviors to DOM elements that will open modal lightbox dialogs
 *  http://northrosedevs.com
 *
 *  Made by Damien Barchowsky
 *  Under MIT License
 */
;( function( $, window, document, undefined ) {

    $.widget( 'northrose.lightboxLink', {

        //Options to be used as defaults
        options: {
            callbacks: {
                modalContentLoaded: null,
                openFailure: null
            },
            dataType: 'html',
            dialogOptions: {
                autoOpen: false,
                closeOnEscape: true,
                dialogClass: 'lightbox',
                height: 'auto',
                modal: true,
                title: '',
                width: 'auto'
            },
            dom: {
                errorContainer: '.alert-error:first',
                modalContainer: '#globalDialog',
                modalContentContainer: '#globalDialog .dialog-content',
                modalErrorContainer: '#globalDialog .alert-error',
                modalWidget: '.ui-dialog',
                overlay: '.ui-widget-overlay'
            },
            event: 'click',
            keys: {
                dataSource: 'src'
            },
            urls: {
                dialogContent: ''
            }
        },

        //Setup widget (eg. element creation, apply theming
        // , bind events etc.)
        _create: function() {
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

            if ( status === 'error' ) {
                /* handle ajax errors */
                this.displayError( 'Error loading dialog: ' + xhr.statusText );
                if ( typeof this.options.callbacks.openFailure === 'function' ) {
                    this.options.callbacks.openFailure( data );
                }
                return;
            }

            /* display the dialog element */
            $( this.options.dom.modalContainer ).dialog( 'open' );

            /* dismiss dialog by clicking on overlay */
            $( this.options.dom.overlay )
                .on( 'click', $.proxy( this.close, this ) );

            /* invoke user-defined callback */
            if ( typeof this.options.callbacks.modalContentLoaded === 'function' ) {
                var f = this.options.callbacks.modalContentLoaded;
                f.apply( this, Array.prototype.slice.call( arguments, 1 ) );
            }
        },

        /**
         * Closes the dialog.
         */
        close: function() {
            $( this.options.dom.modalContainer ).dialog( 'close' );
        },

        /**
         * Retrieves dialog property values from element attributes.
         * @returns object
         */
        collectDialogProperties: function() {
            return {};
        },

        /**
         * Placeholder for routine definition in derived plugin, e.g. formLightboxLink
         */
        commitOperation: function() {
            throw( 'commitOperation() not implemented.' );
        },

        /**
         * Destroy an instantiated plugin and clean up
         * modifications the widget has made to the DOM
         */

        // _destroy: function() {
        // },

        displayError: function( msg ) {
            var $e = $( this.options.dom.errorContainer );
            if ( $e.length === 0 ) {
                return;
            }
            $e.html( msg ).show( 'slow' );
        },

        /**
         * Returns the url to use to fetch lightbox content. First checks 
         * the object's internal "dialogContent" property. If that is 
         * not set, it will check the data- attribute of the element specifying
         * the source.
         * @param data
         * @returns {string}
         */
        getLightboxContentURL: function(data) {
            var url = this.options.urls.dialogContent;
            if (!url) {
                url = $(this.element).data(this.options.keys.dataSource);
            }
            if (!url) {
                throw('Lightbox content not specified!');
            }
            return (url);
        },
        
        /**
         * Event handler that opens a modal dialog in response to an event.
         * @param evt
         */
        open: function( evt ) {
            evt.preventDefault();
            try {
                var data = this.collectDialogProperties();
            }
            catch ( err ) {
                this.displayError(err);
                return;
            }

            try {
                var url = this.getLightboxContentURL(data);
            }
            catch(err) {
                this.displayError(err);
                return;
            }
            
            $( this.options.dom.modalContainer )
                .dialog(this.options.dialogOptions);
            $( this.options.dom.modalContentContainer )
                .load(
                    url,
                    data,
                    $.proxy( this.bindDialogHandlers, this )
                );
        },

        /**
         * Respond to any changes the user makes to the
         * option method
         */
        _setOption: function( key, value ) {
            switch ( key ) {
                case 'someValue':

                    //this.options.someValue = doSomethingWith( value );
                    break;
                default:

                    //this.options[ key ] = value;
                    break;
            }
            this._super( '_setOption', key, value );
        }
    } );

} )( jQuery, window, document );

/*
 *  lightboxLink - v0.1.0
 *  Attach behaviors to DOM elements that will open modal lightbox dialogs
 *  http://northrosedevs.com
 *
 *  Made by Damien Barchowsky
 *  Under MIT License
 */
;( function( $, window, document, undefined ) {

    $.widget( 'northrose.imageLightboxLink', $.northrose.lightboxLink, {

        /**
         * Widget properties.
         */
        options: {
            dataType: 'html',
            dialogOptions: {
                dialogClass: 'lightbox lightbox-image',
                draggable: false,
                resizable: false
            },
            urls: {
                dialogContent: '/ajax/lightbox-image'
            },
            keys: {
                imagePath: 'src',
                imageAltText: 'alt'
            }
        },

        bindDialogHandlers: function( response, status, xhr ) {
            this._super( response, status, xhr );

            /* center the dialog after images have been loaded */
            $( this.options.dom.modalContentContainer + ' img' )
                .off( 'load', $.proxy( this.centerDialog, this ) )
                .on( 'load', $.proxy( this.centerDialog, this ) );

            /* dismiss dialog by clicking on images */
            $( this.options.dom.modalContentContainer + ' img' )
                .off( 'click', $.proxy( this.close, this ) )
                .on( 'click', $.proxy( this.close, this ) );
        },

        centerDialog: function() {
            $( this.options.dom.modalWidget )
                .position( {
                    my: 'center',
                    at: 'center',
                    of: $( this.options.dom.overlay )
                } );
        },

        /**
         * Retrieves dialog property values from element attributes.
         * @returns {{src: *, alt: *}}
         */
        collectDialogProperties: function() {
            var data = {
                src: $( this.element ).data( this.options.keys.imagePath ),
                alt: $( this.element ).data( this.options.keys.imageAltText )
            };
            if ( !data.src ) {
                throw( 'Image not provided.' );
            }
            return data;
        }
    } );

} )( jQuery, window, document );

/*
 *  lightboxLink - v0.1.0
 *  Attach behaviors to DOM elements that will open modal lightbox dialogs
 *  http://northrosedevs.com
 *
 *  Made by Damien Barchowsky
 *  Under MIT License
 */
;( function( $, window, document, undefined ) {

    $.widget( 'northrose.formLightboxLink', $.northrose.lightboxLink, {

        options: {
            dataType: 'html',
            dom: {
                cancelButton: '.dlg-cancel-btn',
                datePicker: '.datepicker',
                submitButton: 'dlg-commit-btn'
            }
        },

        bindDialogHandlers: function( response, status, xhr ) {
            this._super( response, status, xhr );

            /* datepicker widgets */
            $( this.options.dom.datePicker, $( this.element ) ).datepicker();

            /* form buttons */
            $( this.options.dom.submitButton, $( this.element ) )
                .button()
                .on( 'click', $.proxy( this.commitOperation, this ) );
            $( this.options.dom.cancelButton, $( this.element ) )
                .button()
                .on( 'click', $.proxy( this.close, this ) );
        }
    } );

} )( jQuery, window, document );
