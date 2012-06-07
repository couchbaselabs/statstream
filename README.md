To run this:

* get a Couchbase 2.0 cluster running somwhere
* modify statserve.rb to know where that cluster is
* on the site you want to track, add this junk (note you may have to edit the localhost:8888 bit):

    <!-- Start Open Web Analytics Tracker -->
    <script type="text/javascript">
    //<![CDATA[
    var owa_baseUrl = 'http://localhost:8888/Open-Web-Analytics/';
    var owa_cmds = owa_cmds || [];
    owa_cmds.push(['setDebug', true]);
    owa_cmds.push(['setSiteId', '60f8ab']);
    owa_cmds.push(['trackPageView']);
    owa_cmds.push(['trackClicks']);
    owa_cmds.push(['trackDomStream']);

    (function() {
       var _owa = document.createElement('script'); _owa.type = 'text/javascript'; _owa.async = true;
       owa_baseUrl = ('https:' == document.location.protocol ? window.owa_baseSecUrl || owa_baseUrl.replace(/http:/, 'https:') :
       _owa.src = owa_baseUrl + 'modules/base/js/owa.tracker-combined-min.js';
       var _owa_s = document.getElementsByTagName('script')[0]; _owa_s.parentNode.insertBefore(_owa, _owa_s);
    }());
    //]]>
    </script>
    <!-- End Open Web Analytics Code -->

* in theory you can have more than one site, by setting site id to something else. in practice, it'll take more than that to make this software safe for multi-tenancy.
* launch the server with `ruby statserve.rb`
* to view the stats as they are streaming in, visit the / page on the ruby server.

