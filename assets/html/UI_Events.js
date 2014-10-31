/* Notas 
    - Es posible modificar las consultas de los filtros. Tenerlo en cuenta si hay tiempo.
*/

/* Parámetros iniciales de la carga de la página */
$(document).ready(function () {

    localStorage.setItem("modalAbierto", "null");
    localStorage.setItem("nombreModal", null)

    // Colombia = 3686110; 
    var ddl = $('#ddlPais');
    ddl.empty();
    $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(ddl);
    $(document.createElement('option')).attr('value', '3686110').text('Colombia').appendTo(ddl);
    $(document.createElement('option')).attr('value', '000000').text('Exterior').appendTo(ddl);


    $("#datepickerAll").datepicker({ dateFormat: "yy-mm-ddT00:00:00" });
    $("#datepickerEdu").datepicker({ dateFormat: "yy-mm-ddT00:00:00" });
    $("#datepickerEmp").datepicker({ dateFormat: "yy-mm-ddT00:00:00" });
    $("#datepickerPre").datepicker({ dateFormat: "yy-mm-ddT00:00:00" });
    $("#datepickerRec").datepicker({ dateFormat: "yy-mm-ddT00:00:00" });
    $("#datepickerVol").datepicker({ dateFormat: "yy-mm-ddT00:00:00" });
    $("#datepickerDes").datepicker({ dateFormat: "yy-mm-ddT00:00:00" });

    cargarPreferenciasUsuario();

    CargarOfertasDisponibles();




});

/* Método para controlar el popup */
$(window).on('hashchange', function () {

    var nombrePagina = window.location.hash;
    var modalAbierto = localStorage.getItem("modalAbierto");

    if (modalAbierto == "null")
        modalAbierto = "false";

    if (modalAbierto == "true") {
        localStorage.setItem("modalAbierto", "false");
        var nombreModal = localStorage.getItem("nombreModal");
        document.getElementById(nombreModal).style.display = "none";
        localStorage.setItem("nombreModal", "");
    }

    if (nombrePagina.indexOf("ModalAbierto") == 1) {
        var modalNombre = nombrePagina.replace("#ModalAbierto_", "")
        localStorage.setItem("modalAbierto", "true");
        localStorage.setItem("nombreModal", modalNombre)
    }

});

/* General */
function limpiarInterfaz() {

    $('#ListaContentUser').html('');
    $('#ListaContentAll').html('');
    $('#ListaContentEdu').html('');
    $('#ListaContentEmp').html('');
    $('#AllResultsUEmp').html('');
    $('#AllResultsUPre').html('');
    $('#AllResultsP').html('');
    $('#AllResultsCal').html('');
    $('#AllResultsCalEdu').html('');
    $('#PermanentEdu').html('');
    $('#ListaContentPre').html('');
    $('#AllResultsCalEmp').html('');
    $('#ListaContentEmp').html('');
    $('#PermanentEmp').html('');
    $('#ListaContentUser').html('');
    $('#ListaContentRec').html('');
    $('#ListaContentVol').html('');
    $('#ListaContentDes').html('');
}

/*---------------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------------*/

/* Mi Si Joven */
/* Borrar Local Storage */
$("#btnActualizarData").click(function () {

    delete window.localStorage["prefSiJoven"];
    delete window.localStorage["id"];

    localStorage.setItem("Actualizar", "1");

    CargarOfertasDisponibles();

    cargarPreferenciasUsuario();

    var fechaSincro = obtenerFechaActual();
    localStorage.setItem('fechaSincronizacion', fechaSincro);

    var testVal = "LOAD_Carga";

    try {
        AndroidFunctionToast.showToast(testVal);
    }
    catch (err) {
        alert(testVal);
    }
});

/* Cargar preferencias de usuario */
function cargarPreferenciasUsuario() {

    var jsonString = localStorage.getItem('prefSiJoven');

    if (jsonString != "" && jsonString != "[null]" && jsonString != null) {

        var obj = jQuery.parseJSON(jsonString);

        if (obj[0].AC == 1)
            $("#cbAprendeyCrece").prop("checked", true);
        else
            $("#cbAprendeyCrece").prop("checked", false);

        if (obj[0].DT == 1)
            $("#cbDescubreyTrabaja").prop("checked", true);
        else
            $("#cbDescubreyTrabaja").prop("checked", false);

        if (obj[0].CD == 1)
            $("#cbCuidateyDenuncia").prop("checked", true);
        else
            $("#cbCuidateyDenuncia").prop("checked", false);

        if (obj[0].DD == 1)
            $("#cbDivierteteyDisfruta").prop("checked", true);
        else
            $("#cbDivierteteyDisfruta").prop("checked", false);

        if (obj[0].IA == 1)
            $("#cbInvolucrateyAyuda").prop("checked", true);
        else
            $("#cbInvolucrateyAyuda").prop("checked", false);

        if (obj[0].AP == 1)
            $("#cbAnimateyParticipa").prop("checked", true);
        else
            $("#cbAnimateyParticipa").prop("checked", false);


        $("#sliderEdad").attr('value', obj[0].edad);
        $("#my-slider").val(obj[0].ubica);
        $("#my-slider").trigger("change");

        $.getJSON('http://poi.colombiajoven.gov.co/api/pais', function (result) {
            var Uall = $('#ddlPais');
            Uall.empty();
            $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);
            $(document.createElement('option')).attr('value', 'all').text('Todos').appendTo(Uall);

            $(result).each(function () {
                $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
            });

            $("#ddlPais").val(obj[0].pais);
            $("#ddlPais").trigger("change");

            //llenarDDLRegion(obj[0].pais);

            setTimeout(function () {
                $("#ddlRegion").val(obj[0].dep);
                $("#ddlRegion").trigger("change");
            }, 2000);

            setTimeout(function () {
                $("#ddlCiudad").val(obj[0].mun);
                $("#ddlCiudad").trigger("change");
            }, 4000);

            var selectedItem = $("#ddlPais").val();

            if (selectedItem == "3686110") {
                //llenarDDLRegion(selectedItem);
                $('#divDdlCiudad').show();
                $('#divDdlRegion').show();
            }
            else if (selectedItem == "all" || selectedItem != "3686110") {//Exterior 
                $('#divDdlCiudad').hide();
                $('#divDdlRegion').hide();
            }

        });

    }
    else {

        $("#cbAprendeyCrece").prop("checked", false);
        $("#cbDescubreyTrabaja").prop("checked", false);
        $("#cbCuidateyDenuncia").prop("checked", false);
        $("#cbDivierteteyDisfruta").prop("checked", false);
        $("#cbInvolucrateyAyuda").prop("checked", false);
        $("#cbAnimateyParticipa").prop("checked", false);

        $("#sliderEdad").attr('value', 14);
        $("#my-slider").val("off");
    }

    var fechaSincro = localStorage.getItem('fechaSincronizacion');

    if (fechaSincro != null && fechaSincro != "") {

        setTimeout(function () {
            $("#lblFechaSincro").show();
            $("#lblFechaSincro").text("Fecha última sincronizacion: " + fechaSincro);
        }, 5000);
    }
    else {
        fechaSincro = obtenerFechaActual();
        $("#lblFechaSincro").text("Fecha última sincronizacion: " + fechaSincro);
    }
};

/* Navegacion Si Joven*/
$("#btnMiSiJoven").click(function () {
    limpiarInterfaz();
    allResultsSiJoven("ListaContentUser");
});

/* panel Lateral derecho - Ventana Si Joven */
/* Listas de País, ciudad y región - Slider */
$("#ddlPais").change(function () {
    var selectedItem = $(this).val();

    if (selectedItem != null && selectedItem != "") {
        if (selectedItem == "3686110") {

            $('#divDdlCiudad').show();
            $('#divDdlRegion').show();

            $.getJSON('http://poi.colombiajoven.gov.co/api/departamento/' + selectedItem, function (result) {
                var Uall = $('#ddlRegion');
                Uall.empty();
                $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

                $(result).each(function () {
                    if (this.ID != "3686110") {
                        $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
                    }
                });
            });
        }
        else if (selectedItem == "all" || selectedItem != "3686110") {//Exterior 
            $('#divDdlCiudad').hide();
            $('#divDdlRegion').hide();
        }
    }
});
function llenarDDLRegion(selectedItem) {

    if (selectedItem != null && selectedItem != "") {
        $.getJSON('http://poi.colombiajoven.gov.co/api/departamento/' + selectedItem, function (result) {
            var ddl = $('#ddlRegion');
            ddl.empty();

            $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(ddl);

            $(result).each(function () {

                $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(ddl);
            });
        });
    }

}
$("#ddlRegion").change(function () {

    var selectedItem = $(this).val();

    $("#ddlCiudad").empty();

    $.getJSON('http://poi.colombiajoven.gov.co/api/municipio/' + selectedItem,
               function (result) {
                   $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo($('#ddlCiudad'));

                   $(result).each(function () {
                       $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo($('#ddlCiudad'));
                   });

                   $("#ddlCiudad").trigger("change");
                   document.getElementById("ddlCiudad").selectedIndex = "0";
               });

    if (selectedItem == 'all') {
        var Uall = $('#ddlCiudad');
        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);
    }

});
$('#my-slider').change(function () {
    var myswitch = $(this);
    var show = myswitch[0].selectedIndex == 1 ? true : false;
    $('#show-me').toggle(show);
});
$('#selectmenu4').change(function () {
    var myswitch = $(this);
    var show = myswitch[0].selectedIndex == 0 ? true : false;
    $('#LocationCo').toggle(show);
});
$('#guardarBTN').click(function () {

    var datAprendeCrece = "";
    var datDescubreTrabaja = "";
    var datCuidateDenuncia = "";
    var datDivierteteDisfruta = "";
    var datInvolucrateAyuda = "";
    var datAnimateParticipa = "";

    var datsliderEdad = $("#sliderEdad").val();

    var datUbica = $("#my-slider").val();
    var datPais = $("#ddlPais").val();
    var datDep = $("#ddlRegion").val();
    var datMun = $("#ddlCiudad").val();

    if ($("#cbAprendeyCrece").is(':checked')) {
        datAprendeCrece = 1;
    } else {
        datAprendeCrece = 0;
    }

    if ($("#cbDescubreyTrabaja").is(':checked')) {
        datDescubreTrabaja = 1;
    } else {
        datDescubreTrabaja = 0;
    }

    if ($("#cbCuidateyDenuncia").is(':checked')) {
        datCuidateDenuncia = 1;
    } else {
        datCuidateDenuncia = 0;
    }

    if ($("#cbDivierteteyDisfruta").is(':checked')) {
        datDivierteteDisfruta = 1;
    } else {
        datDivierteteDisfruta = 0;
    }

    if ($("#cbInvolucrateyAyuda").is(':checked')) {
        datInvolucrateAyuda = 1;
    } else {
        datInvolucrateAyuda = 0;
    }

    if ($("#cbAnimateyParticipa").is(':checked')) {
        datAnimateParticipa = 1;
    } else {
        datAnimateParticipa = 0;
    }

    jsonObj = [];
    item = {}
    item["AC"] = datAprendeCrece;
    item["DT"] = datDescubreTrabaja;
    item["CD"] = datCuidateDenuncia;
    item["DD"] = datDivierteteDisfruta;
    item["IA"] = datInvolucrateAyuda;
    item["AP"] = datAnimateParticipa;
    item["edad"] = datsliderEdad;
    item["ubica"] = datUbica;
    item["pais"] = datPais;
    item["dep"] = datDep;
    item["mun"] = datMun;

    jsonObj.push(item);
    var jsonString = JSON.stringify(jsonObj);

    localStorage.setItem("prefSiJoven", jsonString);
    limpiarInterfaz();

    setTimeout(allResultsSiJoven("ListaContentUser"), 2000);

    $("#userpanel").panel("close");

    var testVal = "Preferencias almacenadas correctamente.";
    try {
        AndroidFunctionToast.showToast(testVal);
    }
    catch (err) {
        alert(testVal);
    }

    return false;
});

/* Fin Pestaña Lateral Derecha */
/* Fin Mi Si Jovem*/

/*---------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------*/


/* Todo */
/* Navegacion Todo*/
$("#btnTodo, #btnListaAll1, #btnListaAll2, #btnListaAll3").click(function () {
    limpiarInterfaz();
    allResults("ListaContentAll");
});

/* Calendario Todo */
$("#btnCalendarioAll1, #btnCalendarioAll2, #btnCalendarioAll3").click(function () {

    AllResultsP("AllResultsP");

    var fechaAc = $("#datepickerAll").datepicker({ dateFormat: "yy-mm-ddT00:00:00" }).val();;

    AllResultsCal(fechaAc, "AllResultsCal");
});
$("#datepickerAll").change(function () {

    var fechaNC = $(this).val();

    $('#AllResultsCal').empty();

    AllResultsCal(fechaNC, "AllResultsCal");
});

/* Ubicación Todo */
$("#btnUbicacionAll1, #btnUbicacionAll2, #btnUbicacionAll3").click(function () {
    $.getJSON('http://poi.colombiajoven.gov.co/api/pais', function (result) {
        var Uall = $('#UallPaisTodo');
        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);
        $(document.createElement('option')).attr('value', 'all').text('Todos').appendTo(Uall);
        $(document.createElement('option')).attr('value', '3686110').text('Colombia').appendTo(Uall);

        $(result).each(function () {
            if (this.ID != "3686110") {
                $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
            }
        });
    });
});
$("#UallPaisTodo").change(function () {

    var selectedItem = $(this).val();

    if (selectedItem != null && selectedItem != "") {
        if (selectedItem == "3686110") {

            $('#divDdlRegionTodo').show();
            $('#divDdlCiudadTodo').show();

            $.getJSON('http://poi.colombiajoven.gov.co/api/departamento/' + selectedItem, function (result) {
                var Uall = $('#UallRegionTodo');
                Uall.empty();
                $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

                $(result).each(function () {
                    $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
                });
            });
        }
        else if (selectedItem == "all" || selectedItem != "3686110") { //Exterior
            $('#divDdlRegionTodo').hide();
            $('#divDdlCiudadTodo').hide();

            var strPais = $("#UallPaisTodo").val();
            $('#AllResultsU').empty();
            filterResultsU("all", strPais, "", "", "AllResultsU");

        }
    }

});
$("#UallRegionTodo").change(function () {

    var selectedItem = $(this).val();

    $("#UallCiudadTodo").empty();

    $.getJSON('http://poi.colombiajoven.gov.co/api/municipio/' + selectedItem,
               function (result) {
                   $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo($('#UallCiudadTodo'));

                   $(result).each(function () {
                       $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo($('#UallCiudadTodo'));
                   });

                   $("#UallCiudadTodo").trigger("change");
                   document.getElementById("UallCiudadTodo").selectedIndex = "0";
               });

    if (selectedItem == 'all') {
        var Uall = $('#UallCiudadTodo');
        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

        $("#UallCiudadTodo").trigger("change");
        document.getElementById("UallCiudadTodo").selectedIndex = "0";

    }

});
$("#UallCiudadTodo").change(function () {

    var idPais = $("#UallPaisTodo").val();
    var idRegion = $("#UallRegionTodo").val();
    var idCiudad = $(this).val();

    $('#AllResultsU').empty();
    filterResultsU("all", idPais, idRegion, idCiudad, "AllResultsU");
});
/* Fin Todo*/


/*---------------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------------*/



/* Aprende y Crece*/
/* Navegacion Aprende y Crece*/
$("#btnListaEdu, #btnListaEdu1, #btnListaEdu2, #btnListaEdu3").click(function () {
    limpiarInterfaz();
    filterResults(1, "ListaContentEdu");
});

/* Calendario Aprende y Crece */
$("#btnCalendarioEdu1, #btnCalendarioEdu2, #btnCalendarioEdu3").click(function () {
    filterResultsP(1, "PermanentEdu");

    var fechaAcEdu = $("#datepickerEdu").datepicker({ dateFormat: "yy-mm-ddT00:00:00" }).val();;

    console.log("calendario edu: " + fechaAcEdu);

    FilterResultsCal(1, fechaAcEdu, "AllResultsCalEdu");

});
$("#datepickerEdu").change(function () {

    var fechaNC = $(this).val();
    //var fechaAcEdu = $("#datepickerEdu").datepicker({ dateFormat: "yy-mm-ddT00:00:00" }).val();;

    $('#AllResultsCalEdu').empty();

    FilterResultsCal(1, fechaNC, "AllResultsCalEdu");

});

/* Ubicación Aprende y Crece */
$("#btnUbicacionEdu1, #btnUbicacionEdu2, #btnUbicacionEdu3").click(function () {
    $.getJSON('http://poi.colombiajoven.gov.co/api/pais', function (result) {
        var Uall = $('#UallPaisAC');
        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);
        $(document.createElement('option')).attr('value', 'all').text('Todos').appendTo(Uall);
        $(document.createElement('option')).attr('value', '3686110').text('Colombia').appendTo(Uall);


        $(result).each(function () {
            if (this.ID != "3686110") {
                $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
            }
        });
    });
});
$("#UallPaisAC").change(function () {

    var selectedItem = $(this).val();

    if (selectedItem != null && selectedItem != "") {
        if (selectedItem == "3686110") {

            $('#divDdlRegionAC').show();
            $('#divDdlCiudadAC').show();

            $.getJSON('http://poi.colombiajoven.gov.co/api/departamento/' + selectedItem, function (result) {
                var Uall = $('#UallRegionAC');
                Uall.empty();
                $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

                $(result).each(function () {
                    $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
                });
            });
        }
        else if (selectedItem == "all" || selectedItem != "3686110") { //Exterior

            $('#divDdlRegionAC').hide();
            $('#divDdlCiudadAC').hide();

            var strPais = $("#UallPaisAC").val();
            $('#AllResultsUEdu').empty();
            filterResultsU(1, strPais, "", "", "AllResultsUEdu");
        }
    }
});
$("#UallRegionAC").change(function () {

    var selectedItem = $(this).val();

    $("#UallCiudadAC").empty();

    $.getJSON('http://poi.colombiajoven.gov.co/api/municipio/' + selectedItem,
               function (result) {
                   $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo($('#UallCiudadAC'));

                   $(result).each(function () {
                       $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo($('#UallCiudadAC'));
                   });

                   $("#UallCiudadAC").trigger("change");
                   document.getElementById("UallCiudadAC").selectedIndex = "0";
               });

    if (selectedItem == 'all') {
        var Uall = $('#UallCiudadAC');

        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

        $("#UallCiudadAC").trigger("change");
        document.getElementById("UallCiudadAC").selectedIndex = "0";
    }
});
$("#UallCiudadAC").change(function () {

    var idPais = $("#UallPaisAC").val();
    var idRegion = $("#UallRegionAC").val();
    var idCiudad = $(this).val();

    $('#AllResultsUEdu').empty();
    filterResultsU(1, idPais, idRegion, idCiudad, "AllResultsUEdu");
});

/* Fin Aprende y Crece*/

/* Descubre y Trabaja */
/* Navegación Descubre y Trabaja */
$("#btnListaEmp, #btnListaEmp1, #btnListaEmp2, #btnListaEmp3").click(function () {
    limpiarInterfaz();
    filterResults(2, "ListaContentEmp");
});

/* Calendario Descubre y Trabaja */
$("#btnCalendarioEmp1, #btnCalendarioEmp2, #btnCalendarioEmp3").click(function () {

    filterResultsP(2, "PermanentEmp");

    $("#datepickerEmp").datepicker({ dateFormat: "yy-mm-ddT00:00:00" });
    var fechaAcEmp = $("#datepickerEmp").datepicker({ dateFormat: "yy-mm-ddT00:00:00" }).val();

    FilterResultsCal(2, fechaAcEmp, "AllResultsCalEmp");

});
$("#datepickerEmp").change(function () {

    var fechaNC = $(this).val();
    //var fechaAcEmp = $("#datepickerEmp").datepicker({ dateFormat: "yy-mm-ddT00:00:00" }).val();

    $('#AllResultsCalEmp').empty();

    FilterResultsCal(2, fechaNC, "AllResultsCalEmp");
});

/* Ubicación Descubre y Trabaja */
$("#btnUbicacionEmp1, #btnUbicacionEmp2, #btnUbicacionEmp3").click(function () {

    $.getJSON('http://poi.colombiajoven.gov.co/api/pais', function (result) {
        var Uall = $('#UallPaisEmp');
        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);
        $(document.createElement('option')).attr('value', 'all').text('Todos').appendTo(Uall);
        $(document.createElement('option')).attr('value', '3686110').text('Colombia').appendTo(Uall);

        $(result).each(function () {
            if (this.ID != "3686110") {
                $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
            }
        });
    });

});
$("#UallPaisEmp").change(function () {

    var selectedItem = $(this).val();

    if (selectedItem != null && selectedItem != "") {
        if (selectedItem == "3686110") {

            $('#divDdlRegionEmp').show();
            $('#divDdlCiudadEmp').show();

            $.getJSON('http://poi.colombiajoven.gov.co/api/departamento/' + selectedItem, function (result) {
                var Uall = $('#UallRegionEmp');
                Uall.empty();
                $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

                $(result).each(function () {
                    $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
                });
            });
        }
        else if (selectedItem == "all" || selectedItem != "3686110") { //Exterior
            $('#divDdlRegionEmp').hide();
            $('#divDdlCiudadEmp').hide();

            var strPais = $("#UallPaisEmp").val();
            $('#AllResultsUEmp').empty();
            filterResultsU(2, strPais, "", "", "AllResultsUEmp");
        }
    }
});
$("#UallRegionEmp").change(function () {

    var selectedItem = $(this).val();

    $("#UallCiudadEmp").empty();

    $.getJSON('http://poi.colombiajoven.gov.co/api/municipio/' + selectedItem,
               function (result) {
                   $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo($('#UallCiudadEmp'));

                   $(result).each(function () {
                       $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo($('#UallCiudadEmp'));
                   });

                   $("#UallCiudadEmp").trigger("change");
                   document.getElementById("UallCiudadEmp").selectedIndex = "0";
               });

    if (selectedItem == 'all') {
        var Uall = $('#UallCiudadEmp');

        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

        $("#UallCiudadEmp").trigger("change");
        document.getElementById("UallCiudadEmp").selectedIndex = "0";
    }
});
$("#UallCiudadEmp").change(function () {

    var idPais = $("#UallPaisEmp").val();
    var depto = $("#UallRegionEmp").val();
    var ciudad = $(this).val();

    $('#AllResultsUEmp').empty();
    filterResultsU(2, idPais, depto, ciudad, "AllResultsUEmp");
});

/* Fin Descubre y Trabaja */

/* Cuídate y Denuncia */
/* Navegación Cuídate y Denuncia */
$("#btnListaPre, #btnListaPre1, #btnListaPre2, #btnListaPre3").click(function () {
    limpiarInterfaz();
    filterResults(3, "ListaContentPre");

});

/* Calendario Cuídate y Denuncia */
$("#btnCalendarioPre1, #btnCalendarioPre2, #btnCalendarioPre3").click(function () {

    filterResultsP(3, "PermanentPre");

    $("#datepickerPre").datepicker({ dateFormat: "yy-mm-ddT00:00:00" });
    var fechaAcPre = $("#datepickerPre").datepicker({ dateFormat: "yy-mm-ddT00:00:00" }).val();

    FilterResultsCal(3, fechaAcPre, "AllResultsCalPre");

});
$("#datepickerPre").change(function () {

    var fechaNC = $(this).val();

    $('#AllResultsCalPre').empty();

    FilterResultsCal(3, fechaNC, "AllResultsCalPre");
});

/* Ubicación Cuídate y Denuncia */
$("#btnUbicacionPre1, #btnUbicacionPre2, #btnUbicacionPre3").click(function () {
    $.getJSON('http://poi.colombiajoven.gov.co/api/pais', function (result) {
        var Uall = $('#UallPaisPre');
        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);
        $(document.createElement('option')).attr('value', 'all').text('Todos').appendTo(Uall);
        $(document.createElement('option')).attr('value', '3686110').text('Colombia').appendTo(Uall);

        $(result).each(function () {
            if (this.ID != "3686110") {
                $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
            }
        });
    });
});
$("#UallPaisPre").change(function () {

    var selectedItem = $(this).val();

    if (selectedItem != null && selectedItem != "") {
        if (selectedItem == "3686110") {

            $('#divDdlRegionPre').show();
            $('#divDdlCiudadPre').show();

            $.getJSON('http://poi.colombiajoven.gov.co/api/departamento/' + selectedItem, function (result) {
                var Uall = $('#UallRegionPre');
                Uall.empty();
                $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

                $(result).each(function () {
                    $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
                });
            });
        }
        else if (selectedItem == "all" || selectedItem != "3686110") { //Exterior

            $('#divDdlRegionPre').hide();
            $('#divDdlCiudadPre').hide();

            var strPais = $("#UallPaisPre").val();
            $('#AllResultsUPre').empty();
            filterResultsU(3, strPais, "", "", "AllResultsUPre");
        }
    }

});
$("#UallRegionPre").change(function () {

    var selectedItem = $(this).val();

    $("#UallCiudadPre").empty();

    $.getJSON('http://poi.colombiajoven.gov.co/api/municipio/' + selectedItem,
               function (result) {
                   $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo($('#UallCiudadPre'));

                   $(result).each(function () {
                       $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo($('#UallCiudadPre'));
                   });

                   $("#UallCiudadPre").trigger("change");
                   document.getElementById("UallCiudadPre").selectedIndex = "0";
               });

    if (selectedItem == 'all') {
        var Uall = $('#UallCiudadPre');

        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

        $("#UallCiudadPre").trigger("change");
        document.getElementById("UallCiudadPre").selectedIndex = "0";
    }
});
$("#UallCiudadPre").change(function () {

    var idPais = $("#UallPaisPre").val();
    var depto = $("#UallRegionPre").val();
    var ciudad = $(this).val();

    $('#AllResultsUPre').empty();
    filterResultsU(3, idPais, depto, ciudad, "AllResultsUPre");
});

/* Fin Cuídate y Denuncia */

/* Diviértete y Disfruta */
/* Navegación Diviértete y Disfruta */
$("#btnListaRec, #btnListaRec1, #btnListaRec2, #btnListaRec3").click(function () {
    limpiarInterfaz();
    filterResults(4, "ListaContentRec");
});

/* Calendario Diviértete y Disfruta */
$("#btnCalendarioRec1, #btnCalendarioRec2, #btnCalendarioRec3").click(function () {

    filterResultsP(4, "PermanentRec");
    $("#datepickerRec").datepicker({ dateFormat: "yy-mm-ddT00:00:00" });

    var fechaAcRec = $("#datepickerRec").datepicker({ dateFormat: "yy-mm-ddT00:00:00" }).val();;
    FilterResultsCal(4, fechaAcRec, "AllResultsCalRec");


});
$("#datepickerRec").change(function () {

    var fechaNC = $(this).val();
    $('#AllResultsCalRec').empty();
    FilterResultsCal(4, fechaNC, "AllResultsCalRec");
});

/* Ubicación Diviértete y Disfruta */
$("#btnUbicacionRec1, #btnUbicacionRec2, #btnUbicacionRec3").click(function () {

    $.getJSON('http://poi.colombiajoven.gov.co/api/pais', function (result) {
        var Uall = $('#UallPaisRec');
        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);
        $(document.createElement('option')).attr('value', 'all').text('Todos').appendTo(Uall);
        $(document.createElement('option')).attr('value', '3686110').text('Colombia').appendTo(Uall);

        $(result).each(function () {
            if (this.ID != "3686110") {
                $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
            }
        });
    });

});
$("#UallPaisRec").change(function () {

    var selectedItem = $(this).val();

    if (selectedItem != null && selectedItem != "") {
        if (selectedItem == "3686110") {

            $('#divDdlRegionRec').show();
            $('#divDdlCiudadRec').show();

            $.getJSON('http://poi.colombiajoven.gov.co/api/departamento/' + selectedItem, function (result) {
                var Uall = $('#UallRegionRec');
                Uall.empty();
                $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

                $(result).each(function () {
                    $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
                });
            });
        }
        else if (selectedItem == "all" || selectedItem != "3686110") { //Exterior
            $('#divDdlRegionRec').hide();
            $('#divDdlCiudadRec').hide();

            var strPais = $("#UallPaisRec").val();
            $('#AllResultsURec').empty();
            filterResultsU(4, strPais, "", "", "AllResultsURec");
        }
    }

});
$("#UallRegionRec").change(function () {

    var selectedItem = $(this).val();

    $("#UallCiudadRec").empty();

    $.getJSON('http://poi.colombiajoven.gov.co/api/municipio/' + selectedItem,
               function (result) {
                   $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo($('#UallCiudadRec'));

                   $(result).each(function () {
                       $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo($('#UallCiudadRec'));
                   });

                   $("#UallCiudadRec").trigger("change");
                   document.getElementById("UallCiudadRec").selectedIndex = "0";
               });

    if (selectedItem == 'all') {
        var Uall = $('#UallCiudadRec');

        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

        $("#UallCiudadRec").trigger("change");
        document.getElementById("UallCiudadRec").selectedIndex = "0";

    }
});
$("#UallCiudadRec").change(function () {

    var idPais = $("#UallPaisRec").val();
    var depto = $("#UallRegionRec").val();
    var ciudad = $(this).val();

    $('#AllResultsURec').empty();
    filterResultsU(4, idPais, depto, ciudad, "AllResultsURec");
});

/* Fin Diviértete y Disfruta */

/* Involúcrate y Ayuda */
/* Navegación Involúcrate y Ayuda */
$("#btnListaVol, #btnListaVol1, #btnListaVol2, #btnListaVol3").click(function () {
    limpiarInterfaz();
    filterResults(5, "ListaContentVol");
});

/* Calendario Involúcrate y Ayuda */
$("#btnCalendarioVol1, #btnCalendarioVol2, #btnCalendarioVol3").click(function () {

    filterResultsP(5, "PermanentVol");
    $("#datepickerVol").datepicker({ dateFormat: "yy-mm-ddT00:00:00" });

    var fechaAcVol = $("#datepickerVol").datepicker({ dateFormat: "yy-mm-ddT00:00:00" }).val();
    FilterResultsCal(5, fechaAcVol, "AllResultsCalVol");


});
$("#datepickerVol").change(function () {

    var fechaNC = $(this).val();
    $('#AllResultsCalVol').empty();
    FilterResultsCal(5, fechaNC, "AllResultsCalVol");
});

/* Ubicación Involúcrate y Ayuda */
$("#btnUbicacionVol1, #btnUbicacionVol2, #btnUbicacionVol3").click(function () {

    $.getJSON('http://poi.colombiajoven.gov.co/api/pais', function (result) {
        var Uall = $('#UallPaisVol');
        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);
        $(document.createElement('option')).attr('value', 'all').text('Todos').appendTo(Uall);
        $(document.createElement('option')).attr('value', '3686110').text('Colombia').appendTo(Uall);

        $(result).each(function () {
            if (this.ID != "3686110") {
                $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
            }
        });
    });
});
$("#UallPaisVol").change(function () {

    var selectedItem = $(this).val();

    if (selectedItem != null && selectedItem != "") {
        if (selectedItem == "3686110") {

            $('#divDdlRegionVol').show();
            $('#divDdlCiudadVol').show();

            $.getJSON('http://poi.colombiajoven.gov.co/api/departamento/' + selectedItem, function (result) {
                var Uall = $('#UallRegionVol');
                Uall.empty();
                $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

                $(result).each(function () {
                    $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
                });
            });
        }
        else if (selectedItem == "all" || selectedItem != "3686110") { //Exterior
            $('#divDdlRegionVol').hide();
            $('#divDdlCiudadVol').hide();

            var strPais = $("#UallPaisVol").val();
            $('#AllResultsUVol').empty();
            filterResultsU(5, strPais, "", "", "AllResultsUVol");

        }
    }
});
$("#UallRegionVol").change(function () {

    var selectedItem = $(this).val();

    $("#UallCiudadVol").empty();
    console.log(selectedItem)

    $.getJSON('http://poi.colombiajoven.gov.co/api/municipio/' + selectedItem,
               function (result) {
                   $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo($('#UallCiudadVol'));

                   $(result).each(function () {
                       $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo($('#UallCiudadVol'));
                   });

                   $("#UallCiudadVol").trigger("change");
                   document.getElementById("UallCiudadVol").selectedIndex = "0";
               });

    if (selectedItem == 'all') {
        var Uall = $('#UallCiudadVol');

        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

        $("#UallCiudadVol").trigger("change");
        document.getElementById("UallCiudadVol").selectedIndex = "0";

    }
});
$("#UallCiudadVol").change(function () {

    var idPais = $("#UallPaisVol").val();
    var depto = $("#UallRegionVol").val();
    var ciudad = $(this).val();

    $('#AllResultsUVol').empty();
    filterResultsU(5, idPais, depto, ciudad, "AllResultsUVol");
});

/* Fin Involúcrate y Ayuda */

/* Anímate y Participa */
/* Navegación Anímate y Participa */
$("#btnListaDes, #btnListaDes1, #btnListaDes2, #btnListaDes3").click(function () {
    limpiarInterfaz();
    filterResults(6, "ListaContentDes");
});

/* Calendario Anímate y Participa */
$("#btnCalendarioDes1, #btnCalendarioDes2, #btnCalendarioDes3").click(function () {

    filterResultsP(6, "PermanentDes");
    $("#datepickerDes").datepicker({ dateFormat: "yy-mm-ddT00:00:00" });

    var fechaAcDes = $("#datepickerDes").datepicker({ dateFormat: "yy-mm-ddT00:00:00" }).val();;
    FilterResultsCal(6, fechaAcDes, "AllResultsCalDes");


});
$("#datepickerDes").change(function () {

    var fechaNC = $(this).val();
    $('#AllResultsCalDes').empty();
    FilterResultsCal(6, fechaNC, "AllResultsCalDes");
});

/* Ubicación Involúcrate y Ayuda */
$("#btnUbicacionDes1, #btnUbicacionDes2, #btnUbicacionDes3").click(function () {

    $.getJSON('http://poi.colombiajoven.gov.co/api/pais', function (result) {
        var Uall = $('#UallPaisDes');
        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);
        $(document.createElement('option')).attr('value', 'all').text('Todos').appendTo(Uall);
        $(document.createElement('option')).attr('value', '3686110').text('Colombia').appendTo(Uall);

        $(result).each(function () {
            if (this.ID != "3686110") {
                $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
            }
        });
    });

});
$("#UallPaisDes").change(function () {

    var selectedItem = $(this).val();

    if (selectedItem != null && selectedItem != "") {
        if (selectedItem == "3686110") {

            $('#divDdlRegionDes').show();
            $('#divDdlCiudadDes').show();

            $.getJSON('http://poi.colombiajoven.gov.co/api/departamento/' + selectedItem, function (result) {
                var Uall = $('#UallRegionDes');
                Uall.empty();
                $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

                $(result).each(function () {
                    $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo(Uall);
                });
            });
        }
        else if (selectedItem == "all" || selectedItem != "3686110") { //Exterior
            $('#divRegionDes').hide();
            $('#divCiudadDes').hide();

            var strPais = $("#UallPaisDes").val();
            $('#AllResultsUDes').empty();
            filterResultsU(6, strPais, "", "", "AllResultsUDes");

        }
    }

});
$("#UallRegionDes").change(function () {

    var selectedItem = $(this).val();

    $("#UallCiudadDes").empty();
    console.log(selectedItem)

    $.getJSON('http://poi.colombiajoven.gov.co/api/municipio/' + selectedItem,
               function (result) {
                   $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo($('#UallCiudadDes'));

                   $(result).each(function () {
                       $(document.createElement('option')).attr('value', this.ID).text(this.Nombre).appendTo($('#UallCiudadDes'));
                   });

                   $("#UallCiudadDes").trigger("change");
                   document.getElementById("UallCiudadDes").selectedIndex = "0";
               });

    if (selectedItem == 'all') {
        var Uall = $('#UallCiudadDes');

        Uall.empty();
        $(document.createElement('option')).attr('value', '').text('Seleccionar...').appendTo(Uall);

        $("#UallCiudadDes").trigger("change");
        document.getElementById("UallCiudadDes").selectedIndex = "0";

    }
});
$("#UallCiudadDes").change(function () {

    var idPais = $("#UallPaisDes").val();
    var depto = $("#UallRegionDes").val();
    var ciudad = $(this).val();

    $('#AllResultsUDes').empty();
    filterResultsU(6, idPais, depto, ciudad, "AllResultsUDes");
});
