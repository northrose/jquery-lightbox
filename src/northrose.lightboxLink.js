;( function( $, window, document, undefined ) {

    $.widget( 'northrose.lightboxLink', {

        //Options to be used as defaults
        options: {
            callbacks: {
                modalContentLoaded: null,
                openFailure: null
            },
            cssClass: '',
            dataType: 'html',
            dom: {
                errorContainer: '.alert-error:first',
                modalContainer: '#globalDialog',
                modalContentContainer: '#globalDialog .dialog-content',
                modalErrorContainer: '#globalDialog .alert-error',
                modalWidget: '.ui-dialog',
                overlay: '.ui-widget-overlay'
            },
            event: 'click',
            height: 'auto',
            urls: {
                dialogContent: ''
            },
            width: 'auto'
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
         * @returns generic object
         */
        collectDialogProperties: function() {
            var data = {};
            data.url = $( this.element ).data('url');
            if ( !data.url ) {
                throw( 'URL not provided.' );
            }
            return data;
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
         * Event handler that opens a modal dialog in response to an event.
         * @param evt
         */
        open: function( evt ) {
            evt.preventDefault();
            try {
                var data = this.collectDialogProperties();
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
                    title: '',
                    width: this.options.width
                } );
            $( this.options.dom.modalContentContainer )
                .load(
                    this.options.urls.dialogContent,
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
