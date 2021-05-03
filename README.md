## InfographiqJS

Infographiq, ie intelligent interactive infographics, core JavaScript library

## Usage

```html
<!-- infographiq: layout -->
<div class="container-fluid">
  <div class="row">
    <div class="col-md-9">
      <div id="svg"/>
    </div>
    <div class="col-md-3">
      <div id="toc"/>
    </div>
  </div>
</div>

<!-- infographiq: css & js dependencies -->
<script src="https://marinebon.github.io/infographiqJS/libs/bootstrap_v3/bootstrap.min.js"></script>
<link  href="https://marinebon.github.io/infographiqJS/libs/bootstrap_v3/bootstrap.min.css" rel="stylesheet" />
<link  href="https://marinebon.github.io/infographiqJS/libs/font-awesome_v4/css/font-awesome.min.css" rel="stylesheet" />
<script src="https://marinebon.github.io/infographiqJS/libs/d3_v5/js/d3.v5.min.js"></script>
<script src="https://marinebon.github.io/infographiqJS/libs/infographiq_v1.0/js/infographiq.js"></script>
<link  href="https://marinebon.github.io/infographiqJS/libs/infographiq_v1.0/css/infographiq.css" rel="stylesheet" />

<!-- infographiq: link_svg() -->
<script>
  link_svg({
    svg: "https://noaa-iea.github.io/fk-esr-info/assets/svg/FKIEA_Ecosystem.svg", 
    csv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSAROGVpYB58Zkr8P0iwJdTMRPNLZtJ07IyUn-dQ62C2HMuCEScyl8x7urCD7QbRXQYSIJwDn_wku9G/pub?gid=0&single=true&output=csv",
    svg_id: "svg", 
    toc_id: "toc",
    toc_style: "accordion",
    modal_url_pfx: "http://noaa-iea.github.io/fk-esr-info/modals/"});
</script>
```

