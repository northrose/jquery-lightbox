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
