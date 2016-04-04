describe("jQuery Lightbox Core", function() {

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
    it("Should allow custom callback configuration", function () {
        $e.lightbox({
            callbacks: {
                openSuccess: function(data) {
                    return;
                }
            }
        });
        var pluginData = $e.data("plugin_lightbox");
        expect(typeof pluginData.settings.callbacks.openSuccess).toBe("function");
        expect(pluginData.settings.callbacks.openFailure).toBeNull();
    });
});

describe("jQuery Lightbox CSS", function () {
    var $e, instance;

    beforeEach(function () {
        jasmine.getFixtures().fixturesPath = "base/test/spec";
        jasmine.getStyleFixtures().fixturesPath = "base/test/spec";
        loadFixtures("lightbox-spec.html");
        loadStyleFixtures("lightbox-spec.css");
        $e = $(".test-container");
        instance = $e.lightbox().data("plugin_lightbox");
    });
    it("Should have CSS loaded", function () {
        expect($(".hidden").is(":visible")).not.toBe(true);
    });
});

describe("jQuery Lightbox Routines", function () {
    var $e, $body, instance;

    beforeEach(function () {
        jasmine.getFixtures().fixturesPath = "/Users/damien/develop/libraries/jquery-lightbox/test/spec";
        loadFixtures("lightbox-spec.html");
        $body = $("body");
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
        expect($errorContainer.is(":visible")).toBe(false);
        $link.trigger("click");
        expect($errorContainer.html()).toBe("URL not provided.");
        expect($errorContainer.is(":visible")).toBe(true);
    });
});

describe("jQuery Lightbox AJAX", function () {
    var $e, instance,
        request, onSuccess, onFailure;
    beforeEach(function () {
        jasmine.getFixtures().fixturesPath = "base/test/spec";
        jasmine.getStyleFixtures().fixturesPath = "base/test/spec";
        loadFixtures("lightbox-spec.html");
        loadStyleFixtures("lightbox-spec.css");
        $e = $(".test-container");
        instance = $e.lightbox().data("plugin_lightbox");

        jasmine.Ajax.install();
    });

    afterEach(function () {
        jasmine.Ajax.uninstall();
    });

    it("Should allow you to specify a response when needed", function () {

        var ajaxResponse = "<div>This is the test response.</div>";
        var onSuccess = jasmine.createSpy("success");
        var $link = $(".lightbox-link");
        $link.lightbox();
        $link.trigger("click");

        expect(jasmine.Ajax.requests.mostRecent().url).toBe("https://staging.bfhhandwriting.com");
        expect(onSuccess).not.toHaveBeenCalled();

        // jasmine.Ajax.requests.mostRecent().response = ajaxResponse;
        // expect(onSuccess).toHaveBeenCalledWith(ajaxResponse);
    });

    it("Should allow specifying a response ahead of time", function () {
        var onSuccess = jasmine.createSpy("success");
        var onFailure = jasmine.createSpy("failure");
        jasmine.Ajax.stubRequest("https://staging.bfhhandwriting.com").andReturn({
            responseText: 'test'
        });
        var $link = $(".lightbox-link");
        $link.lightbox({
            callbacks: {
                openSuccess: function(data) {
                    onSuccess(data);
                },
                openFailure: function(data) {
                    onFailure(data);
                }
            }
        });
        $link.trigger("click");
        expect(onFailure).toHaveBeenCalledWith('test');
    });
});