## InfographiqJS

Infographiq, ie intelligent interactive infographics, core JavaScript library. For a full tutorial on the Infographiq method, [click here](https://marinebon.org/infographiq/).

## Demonstration

To see the latest functionality, please try the:

- [**demo**](./demo.html)

## Simple Example

Here is a simple infographic example, showing both Illustrator and Inkscape versions of the illustration, to walk through in the instructions:

- [**simple example**](infographiq_example/infographic.html)
- [**download simple example**](./infographiq_example.zip)

## Changes

To see the latest changes, check out the:

- [NEWS](./NEWS.html)

## Usage

This repository _**infographiqJS**_ contains the core JavaScript component of "_infographiq_", ie intelligent interactive infographics, tying together the **Art** icons with a **Table** to find the **Modal** when clicked:

<!--
infographiq-elements - Google Drawing
- Edit: https://docs.google.com/drawings/d/1i0gjyNsWqqTKJqDJ5SPbqHJLWer0OVcuvhySt2ZGgwk/edit
-->

<img src="https://docs.google.com/drawings/d/1i0gjyNsWqqTKJqDJ5SPbqHJLWer0OVcuvhySt2ZGgwk/export/svg" alt="infographiq-elements">


### HTML

Here is an example of the raw HTML to paste into a page for rendering, including three basic components:

1. `layout`: the basic layout, possibly using [Bootstrap grid layout options](https://getbootstrap.com/docs/3.3/css/#grid-options)
2. `css & js dependencies`: Cascading Style Sheets (CSS) and JavaScript (JS) libraries
3. `link_svg()`: the core infographiqJS function; see below and [demo](./demo.html) for setting values of arguments.

```html
<!-- define bootstrap layout that will contain the infographic -->
<div class="container-fluid">
  <div class="row">
    <div class="col-md-9">
      <div id = "svg1"></div>
    </div>
    <div class="col-md-3">
      <ul id="toc1"></ul>
    </div>
  </div>
</div>

<!-- infographiq: load css and javascript dependencies -->
<script src="https://code.jquery.com/jquery-1.9.1.min.js"
  integrity="sha256-wS9gmOZBqsqWxgIVgA8Y9WcQOa7PgSIX+rPA0VL2rbQ="
  crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<script src="https://d3js.org/d3.v5.min.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" />

<!-- load infographiq v1.0 -->
<script src="https://marinebon.github.io/infographiqJS/libs/infographiq_latest/infographiq.js"></script>
<link  href="https://marinebon.github.io/infographiqJS/libs/infographiq_latest/infographiq.css" rel="stylesheet" />

<!--  run infographiq function to create clickable image -->
<script>
  link_svg({
    svg: "illustrator_example.svg", 
    csv: "icon_link.csv", 
    svg_id: "svg1", 
    toc_id: "toc1",
    toc_style: "accordion",
    text_toggle: "toggle_off",
    svg_filter: "illustrator_example.svg"});
</script>
```

### link_svg()

Parameters for the `link_svg()` JavaScript function:
- Required parameters
  - `svg`: art (background + icons) in scalable vector graphics (*.svg) format.
  - `csv`: table in comma-seperated values (*.csv) format
  - Optional parameters
  - `svg_id`: identifier of `<div>` tag for replacing with `svg`; default value of 'svg'.
  - `toc_id`: identifier of `<div>` tag for replacing with table of contents (toc) using `csv`; default value of 'toc'.
  - `hover_color = 'yellow', width = '100%'`
  - `height = '100%'`
  - `modal_url_pfx` : base filepath of modal window hyperlinks
  - `toc_style = "list"`: table of contents (toc) style. Options are: 
    - `"accordion"`: Bootstrap accordion per header
    - `"list"`: bulleted list
    - `"sectioned_list"`: bulleted list with headers
    - `"none"`: skip showing table of contents (toc)
  - `colored_sections = false`
  - `section_colors = ['LightGreen', 'MediumOrchid', 'Orange']`
  - `text_toggle = false`
  - `svg_filter`: value to filter the optional column `svg` by rows in the table `csv` for subsetting the icons to link; default is NULL so all rows are used table. 


## Contributing

To make changes:

1. Edit `infographiq_latest/infographiq.js|css`

1. Update `README.md` documentation and `demo.html` to reflect latest.

1. Copy `infographiq_latest/` into incremental version number `infographiq_v#/`

1. Note changes in `NEWS.md` with header for incremental version number, eg:
  >
  > ## infographiq_v1.0.1
  > 
  > Changed parameter names and supplemented documentation in README:
  > - `svg_location` -> `svg_id`
  > - `csv_location` -> `toc_id`
  > - `text_style`   -> `toc_style`

1. Git commit and push changes


