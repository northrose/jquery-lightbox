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
