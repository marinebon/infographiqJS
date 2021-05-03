## InfographiqJS

Infographiq, ie intelligent interactive infographics, core JavaScript library

## Demonstration

See [demo](./demo.html).

## Usage

### HTML

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
<!-- jquery v1.12.4 -->
<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<!-- bootstrap v3.3.5 -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<!-- d3 v5 -->
<script src="https://d3js.org/d3.v5.min.js"></script>
<!-- font-awesome v4.7 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" />
<!-- infographiq v1.0 -->
<script src="https://marinebon.github.io/infographiqJS/libs/infographiq_v1.0/infographiq.js"></script>
<link  href="https://marinebon.github.io/infographiqJS/libs/infographiq_v1.0/infographiq.css" rel="stylesheet" />

<!-- infographiq: link_svg() -->
<script>
  link_svg({
    svg: "https://noaa-iea.github.io/fk-esr-info/assets/svg/FKIEA_Ecosystem.svg", 
    csv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSAROGVpYB58Zkr8P0iwJdTMRPNLZtJ07IyUn-dQ62C2HMuCEScyl8x7urCD7QbRXQYSIJwDn_wku9G/pub?gid=0&single=true&output=csv",
    svg_location: "svg", 
    csv_location: "toc",
    text_list: "accordion",
    modal_url_pfx: "http://noaa-iea.github.io/fk-esr-info/modals/"});
</script>
```

### link_svg()

Parameters for the `link_svg()` JavaScript function:

- `svg`: art (background + icons) in scalable vector graphics (*.svg) format
- `csv`: table in comma-seperated values (*.csv) format
- `svg_id`: identifier of `<div>` tag for replacing with `svg`
- `toc_id`: identifier of `<div>` tag for replacing with table of contents (toc) using `csv`
- `debug = false` 
- `hover_color = 'yellow', width = '100%'`
- `height = '100%'`
- `modal_id = 'modal'`
- `modal_url_pfx` 
- `toc_style = "list"`: table of contents (toc) style. Options are: 
  - `"accordion"`: Bootstrap accordion per header
  - `"list"`: bulleted list
  - `"sectioned_list"`: bulleted list with headers
  - `"none"`: skip showing table of contents (toc)
- `colored_sections = false`
- `section_colors = ['LightGreen', 'MediumOrchid', 'Orange']`
- `text_toggle = false`


## Contributing

To make changes:

1. Edit `infographiq_latest/infographiq.js|css`

1. Update `README.md` documentation and `demo.html` to reflect latest.

1. Copy `infographiq_latest/` into incremental version number `infographiq_v#/`

1. Note changes in `NEWS.md` with header for incremental version number, eg:
  
  > ## infographiq_v1.0.1
  > 
  > Changed parameter names and supplemented documentation in README:
  > - `svg_location` -> `svg_id`
  > - `csv_location` -> `toc_id`
  > - `text_style`   -> `toc_style`

1. Git commit and push changes

