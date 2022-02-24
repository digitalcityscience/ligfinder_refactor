
export const createHtmlAttributes = (list) =>{
    var response = "<div style='max-height: 25vh;overflow: scroll;'><table class = 'table table-hover '> <tbody>";
    for (var prop in list) {
        response += "<tr> <th>" + prop + "</th> " + "<th>" + list[prop] + "<th> <tr>";
    }
    response += "</tbody></table></div>";

    return response;
}