//import { icon_append } from './iconAppend.js';
//const icon_append = require('./iconAppend.js');

//import { link_table } from "./link_table";
//const link_table = require("./link_table");

// globally scope the variable that will be used to define the tooltip container in the svg
var tooltip_div;

// append div for modal
function appendHtml(el, str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
}

// define tooltip variable globally - this is a hacky quick fix, replace with better solution
this.tooltip_internal = true;

// globally scope the svg elements to be modified when highlighted
var svg_elements = ["circle", "ellipse", "line", "mesh", "path", "polygon", "polyline", "rect", "text"];

//globally scope the variable that defines the properties of the modal window
var modal_html = '<div aria-labelledby="modal-title" class="modal fade bs-example-modal-lg" id="modal" role="dialog" tabindex="-1"><div class="modal-dialog modal-lg" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="modal-title">title</h4></div><div class="modal-body"><iframe data-src="" allow="fullscreen" height="100%" width="100%" frameborder="0"></iframe></div><div class="modal-footer"><button class="btn btn-default btn-sm" data-dismiss="modal">Close</button></div></div></div></div>';

function basename(path) {
     return path.replace(/.*\//, '');
}

// main function to link svg elements to modal popups with data in csv
function link_svg({svg, csv, svg_id = 'svg', toc_id = 'toc', hover_color = 'yellow', width = '100%', 
  height = '100%', modal_url_pfx, toc_style = "list", colored_sections = false,
  section_colors = ['LightGreen', 'MediumOrchid', 'Orange'], text_toggle = 'none',
  svg_filter, full_screen_button = true, button_text = "Full Screen", tooltip = true} = {}) {

  // basic error checking to see if there are elementary errors in the arguments provided to the function
  if (!svg || !csv){
    console.error("ERROR with link_svg function! Values are missing for required parameters in the function: svg, csv");
  }

  if (!document.getElementById(svg_id) || !document.getElementById(toc_id)){
    console.error("ERROR with link_svg function! Div tag specified by svg_id or toc_id in the function link_svg does not exist in this html document.");
  }

  if (text_toggle != 'none' && text_toggle != 'toggle_off' && text_toggle != 'toggle_on'){
    console.error("ERROR with parameter text_toggle in link_svg function! The parameter text_toggle can only have one of the following values: 'none', 'toggle_off', or 'toggle_on'");
  }

  // align tooltip_internal with function parameter
  tooltip_internal = tooltip;

  // open up the svg in d3
  d3.xml(svg).then((f) => {

    // check to see if full screen is possible on this browser, if so create full screen option for svg 
    // (but only if the function parameter full_screen_button is set to true)
    if (full_screen_button && (document.fullscreenEnabled || document.webkitFullscreenEnabled)){ 

      // If this is Safari, when full screen mode has been enabled, the height and width of the svg element have to be 
      // resized by this javascript to actually be full screen. When full screen mode is disabled in Safari, we need to 
      // reset the height and width of the svg element back to the original size.
      var webkitElem = document.getElementById(svg_id);
      webkitElem.addEventListener('webkitfullscreenchange', (event) => {
        if (document.webkitFullscreenElement) {
          webkitElem.style.width = (window.innerWidth) + 'px' ;
          webkitElem.style.height = (window.innerHeight) + 'px'; 
        } else {
          webkitElem.style.width = width; 
          webkitElem.style.height = height; 
        }
      });

      // Add button for full screen option, but only if full_screen_button is toggled to true
      if (full_screen_button) {
        d3.select("#" + toc_id).append("BUTTON")
          .text(" " + button_text)
          .attr("style", "margin-bottom: 5px; font-size: large;")
          .attr("class", "btn btn-info fa fa-arrows-alt btn-block")
          .on("click", openFullScreen)
          .attr("id", "top-button");            
      }

      // Code to activate full screen upon clicking button
      function openFullScreen(){
        var elem = document.getElementById(svg_id);
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        }
      }
    }

    // attach svg into html document
    var div = d3.select('#' + svg_id);
    var f_child = div.node().appendChild(f.documentElement);
    
    // attach modal window into html document, into the svg_id container
    appendHtml(div.node(), modal_html); 

    // append div for svg tooltip
    tooltip_div = d3.select('#' + svg_id).append("div")
      .attr("class", "tooltip");

    // get handle to svg
    var h = d3.select(f_child);

    // full size
    h.attr('width', width)
     .attr('height', height);

    if (text_toggle != 'none'){

      function toggleText(){
        display = d3.select("#" + toc_id + "Checkbox").property("checked") ? "inline" : "none";
        d3.select("#" + svg_id).select("#text").attr("display", display);
      }

      d3.select("#" + toc_id).append("div")
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

      if (text_toggle == 'toggle_on') {
        d3.select("#" + toc_id + "Checkbox").property('checked', true);
      }

    }

    d3.csv(csv).then(function(data) {

      var csv_columns = data.columns;
      var svg_col = csv_columns.indexOf("svg");
      if (svg_col > -1){
        if (!svg_filter) {
          console.error("ERROR! Parameter 'svg_filter' in the function link_svg is undefined. The specified csv file contains a column titled 'svg', which requires 'svg_filter' to be defined.");
        }
        else {
          data = data.filter(d => d.svg === svg_filter);
          if (data.length == 0){
            console.error("ERROR! Value given for 'svg_filter' in the function link_svg can't be found in the 'svg' column of the csv file . All rows of csv file displayed.");
          }
        }
      }

      if (toc_style === "accordion" | toc_style === "sectioned_list"){
        data = data.sort((a,b) => d3.ascending(a.section, b.section) || d3.ascending(a.title, b.title));
        var section_list = [...new Set(data.map(d => d.section))];
      }
      else {
        data = data.sort((a,b) => d3.ascending(a.title, b.title));
      }

      section_color_index = 0;

      if (toc_style === "accordion"){

        d3.select("#" + toc_id)
            .attr("class", "panel-group")
            .attr("role", "tablist")
            .attr("aria-multiselectable", "true");

        for (let i = 0; i < section_list.length; i++) {
          const panelId = toc_id + "Panel" + i;
          const panelSubId = toc_id + "PanelSub" + i;
          const panelTitleId = toc_id + "PanelTitle" + i;
          const collapseId = toc_id + "collapse" + i;
          const bodyId = toc_id + "body" + i;

          d3.select("#" + toc_id).append("div")
            .attr("id", panelId)
            .attr("class", "panel panel-default");
          d3.select("#" + panelId).append("div")
            .attr("id", panelSubId)
            .attr("class", "panel-heading")
            .attr("role", "tab");
          if (colored_sections === true){
            d3.select("#" + panelSubId).attr("style", "background-color: " + section_colors[section_color_index] +  ";");
            hover_color = section_colors[section_color_index];
            section_color_index++;
            if (section_colors.length == section_color_index){
              section_color_index = 0;
            }
          }
          d3.select("#" + panelSubId).append("h4")
            .text(section_list[i])
            .attr("id", panelTitleId)
            .attr("class", "panel-title")
            .attr("data-toggle", "collapse")
            .attr("data-target", "#" + collapseId)
            .attr("role", "button")
            .attr("aria-controls", collapseId);
          d3.select("#" + panelId).append("div")
              .attr("id", collapseId)
              .attr("role", "tabpanel")
              .attr("aria-labelledby", "heading" + i);
          
          var expanded = i === 0;
          var collapse = (expanded)? "panel-collapse collapse in" : "panel-collapse collapse";
          d3.select("#" + panelTitleId).attr("aria-expanded", expanded.toString());
          d3.select("#" + collapseId) .attr("class", collapse);

          d3.select("#" + collapseId).append("div")
            .attr("class", "panel-body")
            .attr("id", bodyId);

          var section_content = d3.select('#' + bodyId).append('ul');

          data.forEach(function(d) {
            if (d.section == section_list[i]){
              element_highlight_add(d.icon, svg_id, hover_color);
              section_content = icon_append(d, h, modal_url_pfx, svg_id, hover_color, section_content);
            }
          })
        }
      } //end: "accordion" toc_style option
      else if (toc_style === "list" | toc_style === "none"){

        var section_content = d3.select('#' + toc_id).append('ul');

        var text_column = toc_style === "list";

        data.forEach(function(d) {
          element_highlight_add(d.icon, svg_id, hover_color);
          section_content = icon_append(d, h, modal_url_pfx, svg_id, hover_color, section_content, text_column);
        })
      } //end: "list" toc_style option
      else if (toc_style === "sectioned_list"){
        section_list.forEach((section, i) => {
          d3.select("#" + toc_id).append("div")
            .attr("class", "section-title")
            .attr("id", toc_id + "Section" + i)
            .text(section)
            .style("background-color", colored_sections ? `background-color: ${section_colors[section_color_index++]};` : null);
          var section_content = d3.select("#" + toc_id).append('ul');

          data.forEach(d => {
            if (d.section === section){
              element_highlight_add(d.icon, svg_id, section_colors[section_color_index-1]);
              section_content = icon_append(d, h, modal_url_pfx, svg_id, section_colors[section_color_index - 1], section_content);
            }
          })
        })
      } //end: "sectioned_list" toc_style option
    }) // end: d3.csv().then({

    .catch(function(error){
      // d3.csv() error
    }); // end: d3.csv()

  // turn off questions by default
  if (text_toggle != 'toggle_on') {
    d3.select("#text").attr("display", "none");
  }
  }); // d3.xml(svg).then((f) => {

}

// This helper function makes a copy of a highlightable element of the svg (icon_id in the function parameters).
// The copy is highlighted in the color indicated by the parameter 'hover_color'. The copy is then hidden.
function element_highlight_add(icon_id, svg_id, hover_color){
  try{
    let selected_svg = document.getElementById(svg_id);
    let p = selected_svg.querySelectorAll("#" + icon_id)[0];
    let p_prime = p.cloneNode(true);
    p_prime.id = icon_id + "_highlight";
    p.parentNode.insertBefore(p_prime, p.parentNode.childNodes[0]);

    for (q = 0; q < 9; q++){
      d3.selectAll("#" + svg_id).selectAll("#" + p_prime.id).selectAll(svg_elements[q])
        .style("stroke-width", 2)
        .style("stroke", hover_color);
    }

    d3.selectAll("#" + svg_id).selectAll("#" + p_prime.id).style("opacity", "0");
  }
  catch {}
}

// This function attaches event handlers to a clickable icon within the svg 
function icon_append(d, h, modal_url_pfx, svg_id, hover_color, section_content, text_column = true){
  
  if (!d.link){
    d.link = (modal_url_pfx && modal_url_pfx.endsWith('/')) ? modal_url_pfx + d.icon + '.html' : d.icon + '.html';
  }else if(!d.link.startsWith('http')){
    d.link = modal_url_pfx + d.link;
  }
  d.title = d.title || d.icon;  // fall back on id if title not set

  // what do in the event an clickable icon or table of contents entry is clicked
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

  function calculateTooltipPosition(svg_id, tooltip_div, y_offset){  
    var svg_position = document.getElementById(svg_id).getBoundingClientRect();
    var right = document.getElementById(svg_id).parentElement.getBoundingClientRect().right;
    var center = window.innerWidth/4;
    let image_right = (document.fullscreenElement || document.webkitFullscreenElement)? right + center : right;

    var x_position, textAlign;
    if ((d3.event.pageX / image_right) > 0.5) {
      x_position = image_right - d3.event.pageX;
      textAlign = "right";
    } else {
      x_position = d3.event.pageX - svg_position.x;
      textAlign = "left";
    }

    tooltip_div.style("left", (textAlign == "left") ?  x_position + "px" : "auto");
    tooltip_div.style("right", (textAlign == "right") ?  x_position + "px" : "auto");
    tooltip_div.style("text-align", textAlign);
    tooltip_div.style("top", (d3.event.pageY - svg_position.y + y_offset - window.scrollY) + "px");
  }

// what do in the event an icon is moused over (when it first enters the icon)
  function handleMouseOver(){
    // determine x and y position of svg 
    var svg_position = document.getElementById(svg_id).getBoundingClientRect();
    var y_offset = 20; //-28;

    d3.selectAll("#" + svg_id).selectAll("#" + d.icon).style("opacity", "0");
    d3.selectAll("#" + svg_id).selectAll("#" + d.icon + "_highlight").style("opacity", "100");
    if (tooltip_internal){
        tooltip_div.html(d.title + "<br/>")
        .style("top", (d3.event.pageY - svg_position.y + y_offset - window.scrollY) + "px")
        .style("background", hover_color)
        .style("opacity", 1.0);
      calculateTooltipPosition(svg_id, tooltip_div, y_offset);
    }
  }

// what do in the event the cursor moves over an icon
  function handleMouseMove(){
    // determine x and y position of svg 
    var y_offset = 20; //-28;
    if (tooltip_internal){
      calculateTooltipPosition(svg_id, tooltip_div, y_offset)
    }
  }

// what do in the event a clickable icon is moused over, if there is not supposed to be a tooltip visible
  function handleMouseOverSansTooltip(){
    d3.selectAll("#" + svg_id).selectAll("#" + d.icon).style("opacity", "0");
    d3.selectAll("#" + svg_id).selectAll("#" + d.icon + "_highlight").style("opacity", "100");
  }

// what to do in the event that a clickable icon or table of contents entry is no longer moused over
  function handleMouseOut(){
    d3.selectAll("#" + svg_id).selectAll("#" + d.icon).style("opacity", "100");
    d3.selectAll("#" + svg_id).selectAll("#" + d.icon + "_highlight").style("opacity", "0");
    if (tooltip_internal){
      tooltip_div.style("opacity", 0);
    }
  }

  // attach relevant Event Handlers to Events, for each individual clickable icon
  h.select('#' + d.icon)
    .on("click", handleClick)
    .on('mouseover', handleMouseOver)
    .on('mouseleave', handleMouseOut)
    .on('mousemove', handleMouseMove);

  // set outline of paths within group to null
  d3.selectAll("#" + svg_id).select('#' + d.icon).selectAll("path")
      .style("stroke-width", null)
      .style("stroke", null);

  if (text_column){
    // add to bulleted list of svg elements
    list_text = d.title ? d.title : d.icon;  // fall back on id if title not set
    section_content.append("li").append("a")
      .text(list_text)
      .on("click", handleClick)
   //   .addEventListener('mouseover', handleMouseOverSansTooltip(d))
      .on('mouseover', handleMouseOverSansTooltip)
      .on('mouseout', handleMouseOut);
  }
  return section_content;
}



// main function to link table elements to modal popups. 
// The only argument taken is 'csvLink' which is a link to a csv file with the following columns:
// EPU, indicator_name, indicator_chunk_title, image_url, caption, alt_text, data_link, time_min, time_max, methods_link
function link_table(csvLink){
  function generateModalContent(data){
    document.getElementById('title').innerHTML = data[1];
    document.getElementById('caption').innerHTML = data[4];
    const img_src = data[3].replace("https://github.com/", "https://raw.githubusercontent.com/").replace("blob/", "");
    const img_target = d3.select('#img_target');
    img_target.select('img').remove();
    img_target.insert('img').attr('src', img_src).attr('alt_text', data[5]).attr('style', 'width:100% ; max-height: auto');
    updateLink('datalink', data[6]);
    updateLink('methodslink', data[9]);
  }

  function updateLink(id, link){
    const link_container = d3.select(`#${id}`)
    link_container.select('a').remove();
    link_container.select('i').remove();
    if (link !== ""){
      link_container.append('i').attr('class', 'fas fa-external-link-alt');

      link_container.append(a).attr('href', link).attr('target', '_blank').html(`${elementId === "datalink" ? " Data Source" : " Graph Methodology"}.`);
    }
  }

  d3.csv(csvLink).then(dataSet => {
    const dataSet1 = dataSet.map(d => Object.values(d));

    $(document).ready(function() {
      var table = $('#example').DataTable( {
            data: dataSet1,
            columnDefs: [
              {targets: [2, 3, 4, 5, 6, 9],
              visible: false,
              searchable: false}],
            columns: [
              { title: 'Ecological Production Unit' },
              { title: 'Indicator name' },
              { title: 'indicator_chunk_title' },
              { title: 'image_url' },
              { title: 'caption' },
              { title: 'alt_text' },   
              { title: 'data_link' },                           
              { title: 'Year Beginning' },
              { title: 'Year End' },
              { title: 'methods_link' }
            ]
        });
      $('#example tbody').on('click', 'tr', function () {
        const data = table.row( this ).data();
        generateModalContent(data);
        document.getElementById('modal1').style.display = 'block';
      });
    });
  });

  const modal = document.getElementById('modal1');
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}