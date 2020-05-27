jQuery(function ($) {
    function initRigSignatures() {
        $('.rigSignatureWrapper').each(function () {
            var $controlWrapper = $(this);
            var $collapsedControls = $controlWrapper.find('.collapseControl .collapsedBitWrapper');
            var $fullControls = $controlWrapper.find('.fullControl .fullBitWrapper');
            var collapseControls = $collapsedControls.find('.collapseArrow');
            collapseControls.click(function () {
                var index = collapseControls.index(this);
                // remove the active control from all elements
                $collapsedControls.removeClass('active');
                $fullControls.removeClass('active');

                $collapsedControls.eq(index).addClass('active');
                $fullControls.eq(index).addClass('active');

                $controlWrapper.addClass('open');
            });

            // remove open class when clicking the hide array
            $controlWrapper.find('.hideArrow').click(function () {
                $controlWrapper.removeClass('open');
            });

            // add a class when View all link is clicked
            $controlWrapper.find('.moreLink a').click(function (evt) {
                evt.preventDefault();
                $(this).closest('.fullBit').addClass('showAll');
            });
        });
    }

    initRigSignatures();
    // listen to a custom event to re-initiate the signatures if needed
    $(document).on('sig-update', initRigSignatures);
});