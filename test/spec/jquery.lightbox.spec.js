describe('jQuery Lightbox Core', function() {

    var $e, $na;

    beforeEach(function () {
        jasmine.getFixtures().fixturesPath = "/Users/damien/develop/libraries/jquery-lightbox/test/spec";
        loadFixtures("lightbox-spec.html");
        $e = $(".test-container");
        $na = $(".bogus-selector");
    });
    it("Should find jQuery", function() {
       expect($).not.toBeNull();
    });
    it("Should find plugin in jQuery", function() {
        expect(typeof $.fn.lightbox).toBe("function");
    });
    it("Should find test container by selector", function() {
        expect($e.length).toBe(1);
    });
    it("Should not find element matching non-existent selector", function() {
        expect($na.length).toBe(0);
    });
    it("Should support chaining jQuery routines", function () {
        expect(typeof $e.lightbox().on).toBe("function");
    });
    it("Should cache plugin instance", function() {
        $e.lightbox();
       expect($e.data("plugin_lightbox")).toBeTruthy();
    });
    it("Should enable custom configuration", function () {
        $e.lightbox({ myKey: "test value"});
        var pluginData = $e.data("plugin_lightbox");
        expect(pluginData.settings.myKey).toBe("test value");
    });
});

describe("jQuery Lightbox Routines", function () {
    var $e, $body, instance;

    beforeEach(function () {
        jasmine.getFixtures().fixturesPath = "/Users/damien/develop/libraries/jquery-lightbox/test/spec";
        loadFixtures("lightbox-spec.html");
        $body = $("body")
        $e = $(".test-container");
        instance = $e.lightbox().data("plugin_lightbox");
    });
    it("Should set error container content when calling displayError()", function() {
        var $errorContainer = $(".alert-error");
        var expectedText = "Test error message";
        instance.displayError(expectedText);
        expect($errorContainer.html()).toBe(expectedText);
    });
    it("Should display error message when url is not specified", function() {
        var $errorContainer = $(".alert-error");
        var $link = $(".lightbox-test-container .link-without-url");
        $link.lightbox();
        $link.trigger("click");
        expect($errorContainer.html()).toBe("URL not provided.");
    });
    it("Should not display error message when url is not specified", function() {
        var $errorContainer = $(".alert-error");
        var $link = $(".lightbox-test-container .lightbox-link");
        $link.lightbox();
        $link.trigger("click");
        expect($errorContainer.html()).toBe("");
    });
});