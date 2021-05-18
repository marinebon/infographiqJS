// append div for tooltip
var tooltip_div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// append div for modal
function appendHtml(el, str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
}

var svg_elements = ["circle", "ellipse", "line", "mesh", "path", "polygon", "polyline", "rect", "text"];

var modal_html = '<div aria-labelledby="modal-title" class="modal fade bs-example-modal-lg" id="modal" role="dialog" tabindex="-1"><div class="modal-dialog modal-lg" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="modal-title">title</h4></div><div class="modal-body"><iframe data-src="" height="100%" width="100%" frameborder="0"></iframe></div><div class="modal-footer"><button class="btn btn-default btn-sm" data-dismiss="modal">Close</button></div></div></div></div>';

appendHtml(document.body, modal_html); // "body" has two more children - h1 and span.

function basename(path) {
     return path.replace(/.*\//, '');
}

// main function to link svg elements to modal popups with data in csv
function link_svg({svg, csv, svg_id = 'svg', toc_id = 'toc', hover_color = 'yellow', width = '100%', 
  height = '100%', modal_url_pfx, toc_style = "list", colored_sections = false,
  section_colors = ['LightGreen', 'MediumOrchid', 'Orange'], text_toggle = false,
  svg_filter} = {}) {

  if (svg == null | csv == null | svg_id == null | toc_id == null){
    console.error("ERROR! Values are missing for the required parameters in the function link_svg: svg, csv, svg_id, toc_id.");
  }

  if (document.getElementById(svg_id) == null | document.getElementById(toc_id) == null){
    console.error("ERROR! Div tag specified by svg_id or toc_id in the function link_svg does not exist in this html document.");
  }

  d3.xml(svg).then((f) => {

    var div = d3.select('#' + svg_id);

    var f_child = div.node().appendChild(f.documentElement);

    // get handle to svg
    var h = d3.select(f_child);

    // full size
    h.attr('width', width)
     .attr('height', height);

    if (text_toggle === true){

      function toggleText(){
        display = d3.select("#" + toc_id + "Checkbox").property("checked") ? "inline" : "none";
        d3.select("#" + svg_id).select("#text").attr("display", display);
      }

      d3.select("#" + toc_id).append("span")
        .text("Text in image: ")
        .attr("font-weight", "bold")
        .attr("id", toc_id + "Wrapper");

      d3.select("#" + toc_id  + "Wrapper").append("label")
        .attr("id", toc_id + "Toggle")
        .attr("class", "switch");

      d3.select("#" + toc_id + "Toggle").append("input")
        .attr("id", toc_id + "Checkbox")
        .attr("type", "checkbox")
        .on("change", toggleText);

      d3.select("#" + toc_id + "Toggle").append("span")
        .attr("class", "slider");

    }

    d3.csv(csv).then(function(data) {

      var csv_columns = data.columns;
      var svg_col = csv_columns.findIndex(element => element == "svg");
      if (svg_col > -1){
        if (csv_rows == null) {
          console.error("ERROR! Parameter 'csv_rows' in the function link_svg is undefined. The specified csv file contains a column titled 'svg', which requires 'csv_rows' to be defined.");
        }
        else {
          var data_subset = [];
          data.forEach(function(d) {
            if (d.svg == csv_rows){
              data_subset.push(d);
            }
          })
          if (data_subset.length == 0){
            console.error("ERROR! Value given for 'csv_rows' in the function link_svg can't be found in the 'svg' column of the csv file . All rows of csv file displayed.");
          }
          else {
            data = data_subset;
          }
        }
      }


      if (toc_style === "accordion" | toc_style === "sectioned_list"){
        data = data.sort(
          function(a,b) { return d3.ascending(a.section, b.section) ||  d3.ascending(a.title, b.title) });
        var section_list = [];
        data.forEach(function(d) {
          if (section_list.length == 0 | section_list[section_list.length - 1] != d.section){
            section_list.push(d.section);
          }
        })
      }
      else {
        data = data.sort(
          function(a,b) { return d3.ascending(a.title, b.title) });
      }

      section_color_index = 0;

      if (toc_style === "accordion"){

        d3.select("#" + toc_id)
            .attr("class", "panel-group")
            .attr("role", "tablist")
            .attr("aria-multiselectable", "true");

        for (let i = 0; i < section_list.length; i++) {
          d3.select("#" + toc_id).append("div")
            .attr("id", toc_id + "Panel" + i)
            .attr("class", "panel panel-default");
          d3.select("#" + toc_id + "Panel" + i).append("div")
            .attr("id", toc_id + "PanelSub" + i)
            .attr("class", "panel-heading")
            .attr("role", "tab");
          if (colored_sections === true){
            d3.select("#" + toc_id + "PanelSub" + i).attr("style", "background-color: " + section_colors[section_color_index] +  ";");
            hover_color = section_colors[section_color_index];
            section_color_index++;
            if (section_colors.length == section_color_index){section_color_index = 0;}
          }
          d3.select("#" + toc_id + "PanelSub" + i).append("h4")
            .text(section_list[i])
            .attr("id", toc_id + "PanelTitle" + i)
            .attr("class", "panel-title")
            .attr("data-toggle", "collapse")
            .attr("data-target", "#" + toc_id + "collapse" + i)
            .attr("role", "button")
            .attr("aria-controls", toc_id + "collapse" + i);
          d3.select("#" + toc_id + "Panel" + i).append("div")
              .attr("id", toc_id + "collapse" + i)
              .attr("role", "tabpanel")
              .attr("aria-labelledby", "heading" + i);
          if (i == 0) {
            d3.select("#" + toc_id + "PanelTitle" + i).attr("aria-expanded", "true");
            d3.select("#" + toc_id + "collapse" + i) .attr("class", "panel-collapse collapse in");
          }
          else {
            d3.select("#" + toc_id + "PanelTitle" + i).attr("aria-expanded", "false");
            d3.select("#" + toc_id + "collapse" + i) .attr("class", "panel-collapse collapse");
          }

          d3.select("#" + toc_id + "collapse" + i).append("div")
            .attr("class", "panel-body")
            .attr("id", toc_id + "body" + i);

          var section_content = d3.select('#' + toc_id + 'body' + i).append('ul');

          data.forEach(function(d) {
            if (d.section == section_list[i]){
              section_content = icon_append(d, h, modal_url_pfx, svg_id, hover_color, section_content);
            }
          })
        }
      } //end: "accordion" toc_style option
      else if (toc_style === "list" | toc_style === "none"){

        var section_content = d3.select('#' + toc_id).append('ul');

        if (toc_style === "list"){text_column = true;}
        else {text_column = false;}

        data.forEach(function(d) {
          section_content = icon_append(d, h, modal_url_pfx, svg_id, hover_color, section_content, text_column);
        })
      } //end: "list" toc_style option
      else if (toc_style === "sectioned_list"){
        for (let i = 0; i < section_list.length; i++) {
          d3.select("#" + toc_id).append("div")
            .attr("class", "section-title")
            .attr("id", toc_id + "Section" + i)
            .text(section_list[i]);
          if (colored_sections === true){
            d3.select("#" + toc_id + "Section" + i).attr("style", "background-color: " + section_colors[section_color_index] +  ";");
            hover_color = section_colors[section_color_index];
            section_color_index++;
            if (section_colors.length == section_color_index){section_color_index = 0;}
          }

          var section_content = d3.select("#" + toc_id).append('ul');

          data.forEach(function(d) {
            if (d.section == section_list[i]){
              section_content = icon_append(d, h, modal_url_pfx, svg_id, hover_color, section_content);
            }
          })
        }
      } //end: "sectioned_list" toc_style option
    }) // end: d3.csv().then({

    .catch(function(error){
      // d3.csv() error
    }); // end: d3.csv()

  // turn off questions by default
  d3.select("#text").attr("display", "none");



  }); // d3.xml(svg).then((f) => {

}

function icon_append(d, h, modal_url_pfx, svg_id, hover_color, section_content, text_column = true){
            if(d.link == null){ // no hyperlink given for modal window
              if(modal_url_pfx != null){ // does value exist for modal_url_pfx 
                if(modal_url_pfx.charAt(modal_url_pfx.length-1) != "/"){ // ensure backslash is last character of variable modal_url_pfx
                  modal_url_pfx = modal_url_pfx + "/";
                }
                // add modal_url_pfx to icon name for modal window hyperlink
                d.link = modal_url_pfx + d.icon + '.html';
              }
              else{ // otherwise, icon name is modal window hyperlink
                d.link = d.icon + '.html';
              }
            }
            else{ // hyperlink given for modal window
              if (d.link.slice(0, 4) != "http"){ //only modify hyperlink if absolute link not given
                if(modal_url_pfx != null){ // does value exist for modal_url_pfx 
                  if(modal_url_pfx.charAt(modal_url_pfx.length-1) != "/"){ // ensure backslash is last character of variable modal_url_pfx
                    modal_url_pfx = modal_url_pfx + "/";
                  }
                // add modal_url_pfx to icon name for modal window hyperlink
                  d.link = modal_url_pfx + d.link;
                }
              }
            }
            d.title = d.title ? d.title : d.icon;  // fall back on id if title not set

            function handleClick(){
              if (d.not_modal == 'T'){
                window.location = d.link;
              } else {

                // https://www.drupal.org/node/756722#using-jquery
                (function ($) {
                  $('#modal').find('iframe')
                    .prop('src', function(){ return d.link });

                  $('#modal' + '-title').html( d.title );

                  $('#modal').on('show.bs.modal', function () {
                    $('.modal-content').css('height',$( window ).height()*0.9);
                    $('.modal-body').css('height','calc(100% - 65px - 55.33px)');
                  });

                  $('#modal').modal();
                }(jQuery));
              }
            }

            function handleMouseOver(){
              for (q = 0; q < 9; q++){
                d3.selectAll("#" + svg_id).selectAll('#' + d.icon).selectAll(svg_elements[q])
                  .style("stroke-width", 2)
                  .style("stroke", hover_color);
              }
              tooltip_div.transition()
                .duration(200)
                .style("opacity", 0.8);
              tooltip_div.html(d.title + "<br/>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            }

            function handleMouseOverSansTooltip(){

              for (q = 0; q < 9; q++){
                d3.selectAll("#" + svg_id).selectAll('#' + d.icon).selectAll(svg_elements[q])
                  .style("stroke-width", 2)
                  .style("stroke", hover_color);
              }
            }

            function handleMouseOut(){

              for (q = 0; q < 9; q++){
                d3.selectAll("#" + svg_id).selectAll('#' + d.icon).selectAll(svg_elements[q])
                  .style("stroke-width", 0);
              }

                tooltip_div.transition()
                  .duration(500);
                tooltip_div.style("opacity", 0);
            }

            h.select('#' + d.icon)
              .on("click", handleClick)
              .on('mouseover', handleMouseOver)
              .on('mouseout', handleMouseOut);

            // set outline of paths within group to null
            d3.selectAll("#" + svg_id).select('#' + d.icon).selectAll("path")
                .style("stroke-width", null)
                .style("stroke", null);

            if (text_column === true){
              // add to bulleted list of svg elements
              list_text = d.title ? d.title : d.icon;  // fall back on id if title not set
              section_content.append("li").append("a")
                .text(list_text)
                .on("click", handleClick)
                .on('mouseover', handleMouseOverSansTooltip)
                .on('mouseout', handleMouseOut);
            }
            return section_content;
}
