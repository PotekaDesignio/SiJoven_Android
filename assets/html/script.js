

jQuery.support.cors = true;

function CargarOfertasDisponibles() {

    var retrievedObject = localStorage.getItem('TodaLaOferta');

    var Actualizar = localStorage.getItem('Actualizar');

    if (Actualizar == "1" || retrievedObject == null) {

        $.ajax({
            dataType: "json",
            url: 'http://poi.colombiajoven.gov.co/api/oferta',
            success:
                    function (data) {
                        ObtenerLocalStorageNumeroOfertas(data);
                        localStorage.setItem('TodaLaOferta', JSON.stringify(data));
                        localStorage.setItem('Actualizar', "0");
                        var fechaSincro = obtenerFechaActual();
                        localStorage.setItem('fechaSincronizacion', fechaSincro);
                        window.location = "index.html";
                    },
            error: function () {

                var online = navigator.onLine;
                var testVal = "";

                if (!online) {
                    testVal = "No se ha detectado conexión a internet.";

                }
                else {
                    testVal = "Se ha presentado un error al consultar el web service. Por favor verifíca tu conexión a internet e inténtalo nuevamente.";
                }

                try {
                    AndroidFunctionToast.showToast(testVal);
                }
                catch (err) {
                    alert(testVal);
                }

                localStorage.setItem('Actualizar', "0");
                var data = JSON.parse(retrievedObject)
                ObtenerLocalStorageNumeroOfertas(data);
            }
        });
    }
    else {
        var data = JSON.parse(retrievedObject)
        ObtenerLocalStorageNumeroOfertas(data);
    }

}

function ObtenerLocalStorageNumeroOfertas(data) {
    var info = [];
    var user = 0, edu = 0, emp = 0, pre = 0, rec = 0, vol = 0, des = 0, all = 0;
    $.each(data, function (key, val) {

        var fechaSel = obtenerFechaActual();

        if (comprobarFechas(val.FechaInicio, val.FechaFin, fechaSel) == true) {
            var img = '/img/ico/ico_300.png'
            switch (val.FkSeccion) {
                case '_***_': user++;
                    break;
                case 1: edu++;
                    break;
                case 2: emp++;
                    break;
                case 3: pre++;
                    break;
                case 4: rec++;
                    break;
                case 5: vol++;
                    break;
                case 6: des++;
                    break;
            }
            all = edu + emp + pre + rec + vol + des;
        }
    });
    $("#CountUser").text(user);
    $("#CountAll").text(all);
    $("#CountEdu").text(edu);
    $("#CountEmp").text(emp);
    $("#CountPre").text(pre);
    $("#CountRec").text(rec);
    $("#CountVol").text(vol);
    $("#CountDes").text(des);
}

function _popup(id) {
    if (confirm(this.id)) {
        localStorage.setItem("id", id);
    }
}
function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
function seccionIMG(seccion) {
    switch (seccion) {
        case 1: img = '1ico_edu.png';
            break;
        case 2: img = '2ico_emp.png';
            break;
        case 3: img = '3ico_pre.png';
            break;
        case 4: img = '4ico_rec.png';
            break;
        case 5: img = '5ico_vol.png';
            break;
        case 6: img = '6ico_des.png';
            break;
    }
    return img;
}

//Lista Todo
// Modificado por George Alvarado - Poteka Designio - 07102014
// Ajuste Realizado:
// Se ajustan los eventos para mostrar el popup. Se aumenta el z-index y se modifica la visibilidad del popup en el momento de cerrarlo

function allResults(elemento) {

    var retrievedObject = localStorage.getItem('TodaLaOferta');

    if (retrievedObject == null) {

        $.ajax({
            dataType: "json",
            url: 'http://poi.colombiajoven.gov.co/api/oferta',
            success:
                    function (data) {
                        CargarDatosWebServicesTodos(data, elemento);
                        localStorage.setItem('TodaLaOferta', JSON.stringify(data));
                        var fechaSincro = obtenerFechaActual();
                        localStorage.setItem('fechaSincronizacion', fechaSincro);
                    },
            error: function () {

                var online = navigator.onLine;
                var testVal = "";

                if (!online) {
                    testVal = "No se ha detectado conexión a internet.";

                }
                else {
                    testVal = "Se ha presentado un error al consultar el web service. Por favor verifíca tu conexión a internet e inténtalo nuevamente.";
                }

                try {
                    AndroidFunctionToast.showToast(testVal);
                }
                catch (err) {
                    alert(testVal);
                }
                window.location = "index.html";
            }
        });

    }
    else {
        var data = JSON.parse(retrievedObject)
        CargarDatosWebServicesTodos(data, elemento);
        ObtenerLocalStorageNumeroOfertas(data);
    }

}
function CargarDatosWebServicesTodos(data, elemento) {

    $("#eventList" + elemento).remove();

    var items = "<ul id='eventList" + elemento + "' data-role='listview' data-inset ='true' data-filter-placeholder='Buscar Oportunidades...' data-filter='true' class'ui-nodisc-icon ui-alt-icon'>";

    $.each(data, function (key, val) {

        var fechaSel = obtenerFechaActual();

        if (comprobarFechas(val.FechaInicio, val.FechaFin, fechaSel) == true) {

            var strFiltro = val.FechaInicio.indexOf("1900-01-01");
            var img = seccionIMG(val.FkSeccion);

            if (val.Oportunidad.length > 0 && val.Activo == 1) {
                var dIni = new Date(val.FechaInicio);

                items = items + "<li data-icon='plus' class='ui-nodisc-icon ui-alt-icon' id='li_" + val.PkOferta + "_1' ><a href='#" + val.PkOferta + "_1'  value =" + val.PkOferta + " data-rel='popup' ><img src='img/ico/" + img + "' style='margin:10px; height: 60px; width: 60px;' /> <h1>" + val.Oportunidad + "</h1> <p>" + val.EntidadNombre + " </p></a></li>";
                items = items + "<script> $('#li_" + val.PkOferta + "_1').click(function () { localStorage.setItem('direccionOriginal', window.location.hash);  filtrarOfertas(" + val.PkOferta + ",1 );});</script>";

            }
        }
    });


    items = items + "<ul/>";
    var container = document.getElementById(elemento);
    $(container).append(items)

    $("#eventList" + elemento).listview();
}

//Lista Filtro
// Modificado por George Alvarado - Poteka Designio - 07102014
// Ajuste Realizado:
// Se ajustan los eventos para mostrar el popup. Se aumenta el z-index y se modifica la visibilidad del popup en el momento de cerrarlo


function filterResults(categoria, elemento) {

    var retrievedObject = localStorage.getItem('TodaLaOferta');

    if (retrievedObject == null) {

        $.ajax({
            dataType: "json",
            url: 'http://poi.colombiajoven.gov.co/api/oferta',
            success:
                    function (data) {
                        filtrarResultados(data, categoria, elemento);
                        localStorage.setItem('TodaLaOferta', JSON.stringify(data));
                        var fechaSincro = obtenerFechaActual();
                        localStorage.setItem('fechaSincronizacion', fechaSincro);
                    },
            error: function () {

                var online = navigator.onLine;
                var testVal = "";

                if (!online) {
                    testVal = "No se ha detectado conexión a internet.";

                }
                else {
                    testVal = "Se ha presentado un error al consultar el web service. Por favor verifíca tu conexión a internet e inténtalo nuevamente.";
                }

                try {
                    AndroidFunctionToast.showToast(testVal);
                }
                catch (err) {
                    alert(testVal);
                }
                window.location = "index.html";
            }
        });

    }
    else {
        var data = JSON.parse(retrievedObject)
        filtrarResultados(data, categoria, elemento);
        ObtenerLocalStorageNumeroOfertas(data);
    }
}
function filtrarResultados(data, categoria, elemento) {

    var items = "<ul id='eventList" + elemento + "' data-role='listview' data-inset ='true' data-filter-placeholder='Buscar Oportunidades...' data-filter='true' class'ui-nodisc-icon ui-alt-icon'>";

    $.each(data, function (key, val) {

        var fechaSel = obtenerFechaActual();

        if (comprobarFechas(val.FechaInicio, val.FechaFin, fechaSel) == true) {

            if (val.FkSeccion == categoria) {

                var strFiltro = val.FechaInicio.indexOf("1900-01-01");

                var img = seccionIMG(val.FkSeccion);

                if (val.Oportunidad.length > 0 && val.Activo == 1) {
                    var dIni = new Date(val.FechaInicio);

                    items = items + ("<li data-icon='plus' class='ui-nodisc-icon ui-alt-icon' id='li_" + val.PkOferta + "_2' ><a href='#" + val.PkOferta + "_2' value =" + val.PkOferta + " data-rel='popup' ><img src='img/ico/" + img + "' style='margin:10px; height: 60px; width: 60px;' /> <h1>" + val.Oportunidad + "</h1> <p>" + val.EntidadNombre + " </p></a></li>");
                    items = items + "<script> $('#li_" + val.PkOferta + "_2').click(function () { localStorage.setItem('direccionOriginal', window.location.hash); filtrarOfertas(" + val.PkOferta + ", 2 );});</script>";
                }
            }
        }
    });
    items = items + "<ul/>";
    var container = document.getElementById(elemento);
    $(container).append(items)

    $("#eventList" + elemento).listview();
}

//EventosPermanentes Todo
// Modificado por George Alvarado - Poteka Designio - 07102014
// Ajuste Realizado:
// Se ajustan los eventos para mostrar el popup. Se aumenta el z-index y se modifica la visibilidad del popup en el momento de cerrarlo

function AllResultsP(elemento) {

    var retrievedObject = localStorage.getItem('TodaLaOferta');

    if (retrievedObject == null) {

        $.ajax({
            dataType: "json",
            url: 'http://poi.colombiajoven.gov.co/api/oferta',
            success:
                    function (data) {
                        TodosResultadosP(data, elemento);
                        localStorage.setItem('TodaLaOferta', JSON.stringify(data));
                        var fechaSincro = obtenerFechaActual();
                        localStorage.setItem('fechaSincronizacion', fechaSincro);
                    },
            error: function () {

                var online = navigator.onLine;
                var testVal = "";

                if (!online) {
                    testVal = "No se ha detectado conexión a internet.";

                }
                else {
                    testVal = "Se ha presentado un error al consultar el web service. Por favor verifíca tu conexión a internet e inténtalo nuevamente.";
                }

                try {
                    AndroidFunctionToast.showToast(testVal);
                }
                catch (err) {
                    alert(testVal);
                }
                window.location = "index.html";
            }
        });

    }
    else {
        var data = JSON.parse(retrievedObject)
        TodosResultadosP(data, elemento);
        ObtenerLocalStorageNumeroOfertas(data);
    }
}
function TodosResultadosP(data, elemento) {
    var items = "<ul id='eventList" + elemento + "' data-role='listview' data-inset ='true' data-filter-placeholder='Buscar Oportunidades...' data-filter='true' class'ui-nodisc-icon ui-alt-icon'>";
    $.each(data, function (key, val) {

        var fechaSel = obtenerFechaActual();

        if (comprobarFechas(val.FechaInicio, val.FechaFin, fechaSel) == true) {

            var strFiltro = val.FechaInicio.indexOf("1900-01-01");
            if (strFiltro != -1) {

                var img = seccionIMG(val.FkSeccion);

                if (val.Oportunidad.length > 0 && val.Activo == 1) {

                    items = items + ("<li data-icon='plus' class='ui-nodisc-icon ui-alt-icon' id='li_" + val.PkOferta + "_3' ><a href='#" + val.PkOferta + "_3' value =" + val.PkOferta + " data-rel='popup' ><img src='img/ico/" + img + "' style='margin:10px; height: 60px; width: 60px;' /> <h1>" + val.Oportunidad + "</h1> <p>" + val.EntidadNombre + " </p></a></li>");
                    items = items + "<script> $('#li_" + val.PkOferta + "_3').click(function () { localStorage.setItem('direccionOriginal', window.location.hash); filtrarOfertas(" + val.PkOferta + ", 3 );});</script>";
                }
            }
        }
    });

    items = items + "<ul/>";
    var container = document.getElementById(elemento);
    $(container).append(items)

    $("#eventList" + elemento).listview();
}


//EventosPermanentes Filtro
function filterResultsP(categoria, elemento) {

    var retrievedObject = localStorage.getItem('TodaLaOferta');

    if (retrievedObject == null) {

        $.ajax({
            dataType: "json",
            url: 'http://poi.colombiajoven.gov.co/api/oferta',
            success:
                    function (data) {
                        FiltrarResultadosP(data, categoria, elemento);
                        localStorage.setItem('TodaLaOferta', JSON.stringify(data));
                        var fechaSincro = obtenerFechaActual();
                        localStorage.setItem('fechaSincronizacion', fechaSincro);
                    },
            error: function () {

                var online = navigator.onLine;
                var testVal = "";

                if (!online) {
                    testVal = "No se ha detectado conexión a internet.";

                }
                else {
                    testVal = "Se ha presentado un error al consultar el web service. Por favor verifíca tu conexión a internet e inténtalo nuevamente.";
                }

                try {
                    AndroidFunctionToast.showToast(testVal);
                }
                catch (err) {
                    alert(testVal);
                }
                window.location = "index.html";
            }
        });

    }
    else {
        var data = JSON.parse(retrievedObject)
        FiltrarResultadosP(data, categoria, elemento);
        ObtenerLocalStorageNumeroOfertas(data);
    }
}
function FiltrarResultadosP(data, categoria, elemento) {

    var items = "<ul id='eventList" + elemento + "' data-role='listview' data-inset ='true' data-filter-placeholder='Buscar Oportunidades...' data-filter='true' class'ui-nodisc-icon ui-alt-icon'>";

    $.each(data, function (key, val) {

        var fechaSel = obtenerFechaActual();

        if (comprobarFechas(val.FechaInicio, val.FechaFin, fechaSel) == true) {

            if (val.FkSeccion == categoria) {

                var strFiltro = val.FechaInicio.indexOf("1900-01-01");

                if (strFiltro != -1) {
                    var img = seccionIMG(val.FkSeccion);

                    if (val.Oportunidad.length > 0 && val.Activo == 1) {

                        items = items + ("<li data-icon='plus' class='ui-nodisc-icon ui-alt-icon' id='li_" + val.PkOferta + "_4'  ><a href='#" + val.PkOferta + "_4' value =" + val.PkOferta + " data-rel='popup' ><img src='img/ico/" + img + "' style='margin:10px; height: 60px; width: 60px;' /> <h1>" + val.Oportunidad + "</h1> <p>" + val.EntidadNombre + " </p></a></li>");
                        items = items + "<script> $('#li_" + val.PkOferta + "_4').click(function () { localStorage.setItem('direccionOriginal', window.location.hash); filtrarOfertas(" + val.PkOferta + ", 4 );});</script>";
                    }
                }
            }
        }
    });

    items = items + "<ul/>";

    var container = document.getElementById(elemento);
    $(container).append(items)

    $("#eventList" + elemento).listview();
}


//Calendario Todos

// Modificado por George Alvarado - Poteka Designio - 07102014
// Ajuste Realizado:
// Se ajustan los eventos para mostrar el popup. Se aumenta el z-index y se modifica la visibilidad del popup en el momento de cerrarlo

function AllResultsCal(fechaSel, elemento) {

    var retrievedObject = localStorage.getItem('TodaLaOferta');

    if (retrievedObject == null) {

        $.ajax({
            dataType: "json",
            url: 'http://poi.colombiajoven.gov.co/api/oferta',
            success:
                    function (data) {
                        TodosResultadosCal(data, fechaSel, elemento);
                        localStorage.setItem('TodaLaOferta', JSON.stringify(data));
                        var fechaSincro = obtenerFechaActual();
                        localStorage.setItem('fechaSincronizacion', fechaSincro);
                    },
            error: function () {

                var online = navigator.onLine;
                var testVal = "";

                if (!online) {
                    testVal = "No se ha detectado conexión a internet.";

                }
                else {
                    testVal = "Se ha presentado un error al consultar el web service. Por favor verifíca tu conexión a internet e inténtalo nuevamente.";
                }

                try {
                    AndroidFunctionToast.showToast(testVal);
                }
                catch (err) {
                    alert(testVal);
                }
                window.location = "index.html";
            }
        });

    }
    else {
        var data = JSON.parse(retrievedObject)
        TodosResultadosCal(data, fechaSel, elemento);
        ObtenerLocalStorageNumeroOfertas(data);
    }

}
function TodosResultadosCal(data, fechaSel, elemento) {

    var items = "<ul id='eventList" + elemento + "' data-role='listview' data-inset ='true' data-filter-placeholder='Buscar Oportunidades...' data-filter='true' class'ui-nodisc-icon ui-alt-icon'>";

    $.each(data, function (key, val) {

        if (comprobarFechas(val.FechaInicio, val.FechaFin, fechaSel) == true) {

            var img = seccionIMG(val.FkSeccion);

            var strFiltro = val.FechaInicio.indexOf("1900-01-01");

            if (val.Oportunidad.length > 0 && val.Activo == 1) {

                items = items + ("<li data-icon='plus' class='ui-nodisc-icon ui-alt-icon' id='li_" + val.PkOferta + "_5' ><a href='#" + val.PkOferta + "_5' value =" + val.PkOferta + " data-rel='popup' ><img src='img/ico/" + img + "' style='margin:10px; height: 60px; width: 60px;' /> <h1>" + val.Oportunidad + "</h1> <p>" + val.EntidadNombre + " </p></a></li>");
                items = items + "<script> $('#li_" + val.PkOferta + "_5').click(function () { localStorage.setItem('direccionOriginal', window.location.hash); filtrarOfertas(" + val.PkOferta + ", 5 );});</script>";

            }
        }
        else {
            console.log("en el filtro no cumple fecha");
        }

    });

    items = items + "<ul/>";
    var container = document.getElementById(elemento);
    $(container).append(items)

    $("#eventList" + elemento).listview();
}

//Calendario Filtro
function FilterResultsCal(cat, fechaSel, elemento) {

    var retrievedObject = localStorage.getItem('TodaLaOferta');

    if (retrievedObject == null) {

        $.ajax({
            dataType: "json",
            url: 'http://poi.colombiajoven.gov.co/api/oferta',
            success:
                    function (data) {
                        FiltrarResultadosCal(data, cat, fechaSel, elemento);
                        localStorage.setItem('TodaLaOferta', JSON.stringify(data));
                        var fechaSincro = obtenerFechaActual();
                        localStorage.setItem('fechaSincronizacion', fechaSincro);
                    },
            error: function () {

                var online = navigator.onLine;
                var testVal = "";

                if (!online) {
                    testVal = "No se ha detectado conexión a internet.";

                }
                else {
                    testVal = "Se ha presentado un error al consultar el web service. Por favor verifíca tu conexión a internet e inténtalo nuevamente.";
                }

                try {
                    AndroidFunctionToast.showToast(testVal);
                }
                catch (err) {
                    alert(testVal);
                }
                window.location = "index.html";
            }
        });

    }
    else {
        var data = JSON.parse(retrievedObject)
        FiltrarResultadosCal(data, cat, fechaSel, elemento);
        ObtenerLocalStorageNumeroOfertas(data);
    }
}
function FiltrarResultadosCal(data, cat, fechaSel, elemento) {

    $("#eventList" + elemento).remove();

    var items = "<ul id='eventList" + elemento + "' data-role='listview' data-inset ='true' data-filter-placeholder='Buscar Oportunidades...' data-filter='true' class'ui-nodisc-icon ui-alt-icon'>";

    $.each(data, function (key, val) {


        if (val.FkSeccion == cat) {

            if (comprobarFechas(val.FechaInicio, val.FechaFin, fechaSel)) {

                var img = seccionIMG(val.FkSeccion);

                if (val.Oportunidad.length > 0 && val.Activo == 1) {

                    items = items + ("<li data-icon='plus' class='ui-nodisc-icon ui-alt-icon' id='li_" + val.PkOferta + "_6' ><a href='#" + val.PkOferta + "_6' value =" + val.PkOferta + " data-rel='popup' ><img src='img/ico/" + img + "' style='margin:10px; height: 60px; width: 60px;' /> <h1>" + val.Oportunidad + "</h1> <p>" + val.EntidadNombre + " </p></a></li>");
                    items = items + "<script> $('#li_" + val.PkOferta + "_6').click(function () { localStorage.setItem('direccionOriginal', window.location.hash); filtrarOfertas(" + val.PkOferta + ", 6 );});</script>";
                }
            }
        }

    });

    items = items + "<ul/>";
    var container = document.getElementById(elemento);
    $(container).append(items)

    $("#eventList" + elemento).listview();
}


//Ubicacion Todas Ofertas
function AllResultsUJG(pais, depto, ciudad, elemento) {

    var retrievedObject = localStorage.getItem('TodaLaOferta');

    if (retrievedObject == null) {

        $.ajax({
            dataType: "json",
            url: 'http://poi.colombiajoven.gov.co/api/oferta',
            success:
                    function (data) {
                        TodosResultadosUJG(data, pais, depto, ciudad, elemento);
                        localStorage.setItem('TodaLaOferta', JSON.stringify(data));
                        var fechaSincro = obtenerFechaActual();
                        localStorage.setItem('fechaSincronizacion', fechaSincro);
                    },
            error: function () {

                var online = navigator.onLine;
                var testVal = "";

                if (!online) {
                    testVal = "No se ha detectado conexión a internet.";

                }
                else {
                    testVal = "Se ha presentado un error al consultar el web service. Por favor verifíca tu conexión a internet e inténtalo nuevamente.";
                }

                try {
                    AndroidFunctionToast.showToast(testVal);
                }
                catch (err) {
                    alert(testVal);
                }
                window.location = "index.html";
            }
        });

    }
    else {
        var data = JSON.parse(retrievedObject)
        TodosResultadosUJG(data, pais, depto, ciudad, elemento);
        ObtenerLocalStorageNumeroOfertas(data);
    }

}
function TodosResultadosUJG(data, pais, depto, ciudad, elemento) {

    var items = "<ul id='eventList" + elemento + "' data-role='listview' data-inset ='true' data-filter-placeholder='Buscar Oportunidades...' data-filter='true' class'ui-nodisc-icon ui-alt-icon'>";

    $.each(data, function (key, val) {

        var fechaSel = obtenerFechaActual();

        if (comprobarFechas(val.FechaInicio, val.FechaFin, fechaSel) == true) {

            if (pais != '3686110') { //No es Colombia
                var img = seccionIMG(val.FkSeccion);

                if (val.Oportunidad.length > 0 && val.Activo == 1) {

                    items = items + ("<li data-icon='plus' class='ui-nodisc-icon ui-alt-icon' ><a href='#" + val.PkOferta + "_7' value =" + val.PkOferta + " data-rel='popup' ><img src='img/ico/" + img + "' style='margin:10px; height: 60px; width: 60px;' /> <h1>" + val.Oportunidad + "</h1> <p>" + val.EntidadNombre + " </p></a></li>");
                    items = items + "<script> $('#li_" + val.PkOferta + "_7').click(function () { filtrarOfertas(" + val.PkOferta + ", 7 );});</script>";

                }
            } else if (val.FkPais == "3686110" && (val.FkCiudad == ciudad || val.FkRegion == depto)) {  //Es Colombia
                var img = seccionIMG(val.FkSeccion);

                if (val.Oportunidad.length > 0) {

                    items = items + ("<li data-icon='plus' class='ui-nodisc-icon ui-alt-icon' ><a href='#" + val.PkOferta + "_11' value =" + val.PkOferta + " data-rel='popup' ><img src='img/ico/" + img + "' style='margin:10px; height: 60px; width: 60px;' /> <h1>" + val.Oportunidad + "</h1> <p>" + val.EntidadNombre + " </p></a></li>");
                    items = items + "<script> $('#li_" + val.PkOferta + "_11').click(function () { localStorage.setItem('direccionOriginal', window.location.hash); filtrarOfertas(" + val.PkOferta + ", 11 );});</script>";

                }
            }
        }
    });

    items = items + "<ul/>";
    var container = document.getElementById(elemento);
    $(container).append(items)

    $("#eventList" + elemento).listview();
}

//Ubicacion Todo
// Este método de ubicacion está filtrando por ciudad. Pero los datos del dataset no traen ciudad... Preguntar
function AllResultsU(dep, elemento) {

    var retrievedObject = localStorage.getItem('TodaLaOferta');

    if (retrievedObject == null) {

        $.ajax({
            dataType: "json",
            url: 'http://poi.colombiajoven.gov.co/api/oferta',
            success:
                    function (data) {
                        TodosResultadosU(data, dep, elemento);
                        localStorage.setItem('TodaLaOferta', JSON.stringify(data));
                        var fechaSincro = obtenerFechaActual();
                        localStorage.setItem('fechaSincronizacion', fechaSincro);
                    },
            error: function () {

                var online = navigator.onLine;
                var testVal = "";

                if (!online) {
                    testVal = "No se ha detectado conexión a internet.";

                }
                else {
                    testVal = "Se ha presentado un error al consultar el web service. Por favor verifíca tu conexión a internet e inténtalo nuevamente.";
                }

                try {
                    AndroidFunctionToast.showToast(testVal);
                }
                catch (err) {
                    alert(testVal);
                }
                window.location = "index.html";
            }
        });

    }
    else {
        var data = JSON.parse(retrievedObject)
        TodosResultadosU(data, dep, elemento);
        ObtenerLocalStorageNumeroOfertas(data);
    }
}
function TodosResultadosU(data, dep, elemento) {

    var items = "<ul id='eventList" + elemento + "' data-role='listview' data-inset ='true' data-filter-placeholder='Buscar Oportunidades...' data-filter='true' class'ui-nodisc-icon ui-alt-icon'>";

    $.each(data, function (key, val) {

        var fechaSel = obtenerFechaActual();

        if (comprobarFechas(val.FechaInicio, val.FechaFin, fechaSel) == true) {

            if (dep == "all") {
                dep = val.FkRegion;
            }

            if (val.FkRegion == dep) {

                var strFiltro = val.FechaInicio.indexOf("1900-01-01");

                var img = seccionIMG(val.FkSeccion);

                if (val.Oportunidad.length > 0 && val.Activo == 1) {

                    items = items + ("<li data-icon='plus' class='ui-nodisc-icon ui-alt-icon' id='li_" + val.PkOferta + "_8' ><a href='#" + val.PkOferta + "_8' value =" + val.PkOferta + " data-rel='popup' ><img src='img/ico/" + img + "' style='margin:10px; height: 60px; width: 60px;' /> <h1>" + val.Oportunidad + "</h1> <p>" + val.EntidadNombre + " </p></a></li>");
                    items = items + "<script> $('#li_" + val.PkOferta + "_8').click(function () { localStorage.setItem('direccionOriginal', window.location.hash); filtrarOfertas(" + val.PkOferta + ", 8 );});</script>";
                }
            }
        }
    });

    items = items + "<ul/>";
    var container = document.getElementById(elemento);
    $(container).append(items)

    $("#eventList" + elemento).listview();

    $("div[id$='_']").popup();
    $("div[id$='_CSet']").collapsibleset();
    $("div[id$='_Nbar']").navbar();

}


//Ubicacion Filtro
function filterResultsU(cat, pais, region, ciudad, elemento) {

    var retrievedObject = localStorage.getItem('TodaLaOferta');

    if (retrievedObject == null) {

        $.ajax({
            dataType: "json",
            url: 'http://poi.colombiajoven.gov.co/api/oferta',
            success:
                    function (data) {
                        FiltrarResultadosU(data, cat, pais, region, ciudad, elemento);
                        localStorage.setItem('TodaLaOferta', JSON.stringify(data));
                        var fechaSincro = obtenerFechaActual();
                        localStorage.setItem('fechaSincronizacion', fechaSincro);
                    },
            error: function () {

                var online = navigator.onLine;
                var testVal = "";

                if (!online) {
                    testVal = "No se ha detectado conexión a internet.";

                }
                else {
                    testVal = "Se ha presentado un error al consultar el web service. Por favor verifíca tu conexión a internet e inténtalo nuevamente.";
                }

                try {
                    AndroidFunctionToast.showToast(testVal);
                }
                catch (err) {
                    alert(testVal);
                }
                window.location = "index.html";
            }
        });

    }
    else {
        var data = JSON.parse(retrievedObject);
        FiltrarResultadosU(data, cat, pais, region, ciudad, elemento);
        ObtenerLocalStorageNumeroOfertas(data);
    }
}
function FiltrarResultadosU(data, cat, pais, region, ciudad, elemento) {

    var items = "<ul id='eventList" + elemento + "' data-role='listview' data-inset ='true' data-filter-placeholder='Buscar Oportunidades...' data-filter='true' class'ui-nodisc-icon ui-alt-icon'>";
    var paisDummie = "";
    var categoriaDummie = "";
    var regionDummie = "";
    var ciudadDummie = "";

    $.each(data, function (key, val) {

        if (cat == "all") {
            categoriaDummie = val.FkSeccion;
        }
        else {
            categoriaDummie = cat;
        }

        if (region == "all" || region == "-2147483648") {
            regionDummie = val.FkRegion;
        }
        else {
            regionDummie = region;
        }

        if (ciudad == "all" || ciudad == "-2147483648") {
            ciudadDummie = val.FkCiudad;
        }
        else {
            ciudadDummie = ciudad;
        }

        var fechaSel = obtenerFechaActual();

        console.log(pais);

        if (comprobarFechas(val.FechaInicio, val.FechaFin, fechaSel) == true) {

            if (val.FkSeccion == categoriaDummie) {
                if (pais == "all") {
                    var img = seccionIMG(val.FkSeccion);

                    console.log("exteriorizate");

                    if (val.Oportunidad.length > 0 && val.Activo == 1) {
                        console.log("ofertas");
                        items = items + "<li data-icon='plus' class='ui-nodisc-icon ui-alt-icon' id='li_" + val.PkOferta + "_9'  ><a href='#" + val.PkOferta + "_9' value =" + val.PkOferta + " data-rel='popup' ><img src='img/ico/" + img + "' style='margin:10px; height: 60px; width: 60px;' /> <h1>" + val.Oportunidad + "</h1> <p>" + val.EntidadNombre + " </p></a></li>";
                        items = items + "<script> $('#li_" + val.PkOferta + "_9').click(function () { localStorage.setItem('direccionOriginal', window.location.hash); filtrarOfertas(" + val.PkOferta + ", 9 );});</script>";

                    }
                }
                else {
                    if (val.FkCiudad == ciudadDummie && ciudadDummie == "-2147483648") {
                        if (val.FkRegion == regionDummie || val.FkRegion == "-2147483648") {
                            var img = seccionIMG(val.FkSeccion);

                            if (val.FkPais == "3686110" && val.Oportunidad.length > 0 && val.Activo == 1) {
                                console.log("ofertas");
                                items = items + "<li data-icon='plus' class='ui-nodisc-icon ui-alt-icon' id='li_" + val.PkOferta + "_9'  ><a href='#" + val.PkOferta + "_9' value =" + val.PkOferta + " data-rel='popup' ><img src='img/ico/" + img + "' style='margin:10px; height: 60px; width: 60px;' /> <h1>" + val.Oportunidad + "</h1> <p>" + val.EntidadNombre + " </p></a></li>";
                                items = items + "<script> $('#li_" + val.PkOferta + "_9').click(function () { localStorage.setItem('direccionOriginal', window.location.hash); filtrarOfertas(" + val.PkOferta + ", 9 );});</script>";
                            }
                        }
                    } else if (val.FkRegion == regionDummie) {
                        if (val.FkCiudad == ciudadDummie) {
                            var img = seccionIMG(val.FkSeccion);

                            if (val.FkPais == "3686110" && val.Oportunidad.length > 0 && val.Activo == 1) {
                                console.log("ofertas");
                                items = items + "<li data-icon='plus' class='ui-nodisc-icon ui-alt-icon' id='li_" + val.PkOferta + "_9'  ><a href='#" + val.PkOferta + "_9' value =" + val.PkOferta + " data-rel='popup' ><img src='img/ico/" + img + "' style='margin:10px; height: 60px; width: 60px;' /> <h1>" + val.Oportunidad + "</h1> <p>" + val.EntidadNombre + " </p></a></li>";
                                items = items + "<script> $('#li_" + val.PkOferta + "_9').click(function () { localStorage.setItem('direccionOriginal', window.location.hash); filtrarOfertas(" + val.PkOferta + ", 9 );});</script>";
                            }
                        }
                    }
                }
            }
        }
    });

    items = items + "<ul/>";
    var container = document.getElementById(elemento);
    $(container).append(items);

    $("#eventList" + elemento).listview();
}

// Lista MiSíJoven

// Modificado por George Alvarado - Poteka Designio - 07102014
// Ajuste Realizado:
// Se ajustan los eventos para mostrar el popup. Se aumenta el z-index y se modifica la visibilidad del popup en el momento de cerrarlo

function allResultsSiJoven(elemento) {

    var retrievedObject = localStorage.getItem('TodaLaOferta');

    if (retrievedObject == null) {
        $.ajax({
            dataType: "json",
            url: 'http://poi.colombiajoven.gov.co/api/oferta',
            success:
                function (data) {
                    CargarDatosWebServiceSiJoven(data, elemento);
                    localStorage.setItem('TodaLaOferta', JSON.stringify(data));
                    var fechaSincro = obtenerFechaActual();
                    localStorage.setItem('fechaSincronizacion', fechaSincro);
                },
            error: function () {

                var online = navigator.onLine;
                var testVal = "";

                if (!online) {
                    testVal = "No se ha detectado conexión a internet.";

                }
                else {
                    testVal = "Se ha presentado un error al consultar el web service. Por favor verifíca tu conexión a internet e inténtalo nuevamente.";
                }

                try {
                    AndroidFunctionToast.showToast(testVal);
                }
                catch (err) {
                    alert(testVal);
                }
                window.location = "index.html";
            }
        });

    }
    else {
        var data = JSON.parse(retrievedObject);
        CargarDatosWebServiceSiJoven(data, elemento);
        ObtenerLocalStorageNumeroOfertas(data);
    }
}
function CargarDatosWebServiceSiJoven(data, elemento) {

    var nombreContenedor = elemento;


    var items = "<ul id='eventList" + elemento + "' data-role='listview' data-inset ='true' data-filter-placeholder='Buscar Oportunidades...' data-filter='true' class'ui-nodisc-icon ui-alt-icon'>";
    var jsonfile = "";
    if (localStorage.getItem('prefSiJoven')) {
        jsonfile = 1;
    }
    else {
        jsonfile = 0;
    }
    var verif = "";

    $.each(data, function (key, val) {

        var fechaSel = obtenerFechaActual();

        if (comprobarFechas(val.FechaInicio, val.FechaFin, fechaSel) == true) {

            var img = seccionIMG(val.FkSeccion);
            verif = 0;

            if (jsonfile == 0) { verif = 1; }
            else {
                verif = validarPSiJoven(val.FkSeccion, val.EdadMaxima, val.EdadMinima, val.FkPais, val.FkRegion);
            }

            if (val.Oportunidad.length > 0 && verif == 1 && val.Activo == 1) {
                items = items + "<li data-icon='plus' class='ui-nodisc-icon ui-alt-icon' id='li_" + val.PkOferta + "_0'  ><a href='#" + val.PkOferta + "_0' value =" + val.PkOferta + " data-rel='popup' ><img src='img/ico/" + img + "' style='margin:10px; height: 60px; width: 60px;' /> <h1>" + val.Oportunidad + "</h1> <p>" + val.EntidadNombre + " </p></a></li>";

                items = items + "<script> $('#li_" + val.PkOferta + "_0').click(function () { localStorage.setItem('direccionOriginal', window.location.hash); filtrarOfertas(" + val.PkOferta + ", 0 );});</script>";
            }
        }
    });

    items = items + "<ul/>";
    var container = document.getElementById(elemento);
    $(container).append(items)

    $("#eventList" + elemento).listview();
}


// valida si cumple las preferencias
function validarPSiJoven(cat, edadMax, edadMin, pais, region) {

    var control = 0;

    var val1 = 0;
    var val2 = 0;
    var val3 = 0;
    var val4 = 0;

    if (pais != '3686110') {
        pais = "otros";
    }

    var jsonString = localStorage.getItem('prefSiJoven');

    var obj = jQuery.parseJSON(jsonString);

    if (cat == 1) { if (obj[0].AC == 1) { val1 = 1; } }
    if (cat == 2) { if (obj[0].DT == 1) { val1 = 1; } }
    if (cat == 3) { if (obj[0].CD == 1) { val1 = 1; } }
    if (cat == 4) { if (obj[0].DD == 1) { val1 = 1; } }
    if (cat == 5) { if (obj[0].IA == 1) { val1 = 1; } }
    if (cat == 6) { if (obj[0].AP == 1) { val1 = 1; } }

    var edadPref = obj[0].edad;

    if (edadPref >= edadMin && edadPref <= edadMax) { val2 = 1; }

    if (obj[0].ubica == "off") {
        val3 = 1; val4 = 1;
    }
    else {
        if (obj[0].dep == "all") {
            obj[0].dep = region;
        }

        if (pais == obj[0].pais) {
            val3 = 1;

            if (pais == 'otros') {
                val4 = 1;
            }
            else {
                if (region == obj[0].dep) {
                    val4 = 1;
                }
            }

        }
    }

    if (val1 == 1 && val2 == 1 && val3 == 1 && val4 == 1) { control = 1; }

    return control;
}

// convierte fecha a timestamp de 2014-08-24T00:00:00 a 1408856400
function convertirFecha(fecha) {

    var nuevaF1 = "1900-01-01";

    if (fecha != undefined) {
        fecha = fecha.split('T');
        var fechap1 = fecha[0];
        fechap1 = fechap1.split("-");
        var nuevaF = fechap1[1] + "/" + fechap1[2] + "/" + fechap1[0];
        nuevaF1 = new Date(nuevaF).getTime();
    }

    return nuevaF1;
}

function comprobarFechas(dateFrom, dateTo, dateCheck) {

    var dateFromFull = dateFrom.split('T');
    var dateFrom1 = dateFromFull[0];

    var dateToFull = dateTo.split('T');
    var dateTo1 = dateToFull[0];

    var dateCheckFull;
    var dateCheck1;
    var dateCheck2;
    var dateCheck3;

    if (dateCheck.indexOf("/") > 0) {
        dateCheck3 = dateCheck;

    }
    else {
        dateCheckFull = dateCheck.split('T');
        dateCheck1 = dateCheckFull[0];
        dateCheck2 = dateCheck1.replace("-", "/");
        dateCheck3 = dateCheck2.replace("-", "/");
    }

    if (dateFrom.indexOf("1900") == 0 && dateCheck.indexOf("/") > 0) {
        return true;
    }


    var dateFromFull = dateFrom.split('T');
    var dateFrom1 = dateFromFull[0];

    var dateToFull = dateTo.split('T');
    var dateTo1 = dateToFull[0];

    var dateFrom2 = dateFrom1.replace("-", "/");
    var dateTo2 = dateTo1.replace("-", "/");

    var dateFrom3 = dateFrom2.replace("-", "/");
    var dateTo3 = dateTo2.replace("-", "/");


    var d1 = dateFrom3.split("/");
    var d2 = dateTo3.split("/");
    var c = dateCheck3.split("/");

    var from = new Date(d1[0], d1[1] - 1, d1[2]);  // -1 because months are from 0 to 11
    var to = new Date(d2[0], d2[1] - 1, d2[2]);

    var check;

    if (dateCheckFull == null) {
        check = new Date(c[2], c[1] - 1, c[0]);
    }
    else {
        check = new Date(c[0], c[1] - 1, c[2]);
    }


    if (check >= from && check <= to)
        return true;
    else
        return false;
}

function mostrarCorrectamenteFecha(fechaAFormatear) {

    var fechaRetornoCompleta = fechaAFormatear.split('T');
    var fechaAjustada = fechaRetornoCompleta[0];

    fechaAjustada = fechaAjustada.replace("-", "/");
    fechaAjustada = fechaAjustada.replace("-", "/");

    return fechaAjustada;
}

// convierte el código del pais por Colombia o Extranjero
function convertirNPais(pais) {

    var fnJS = "";
    console.log(pais);

    $.ajax({
        dataType: "json",
        url: 'http://poi.colombiajoven.gov.co/api/pais/' + pais,
        async: false,
        success:
                function (data) {
                    $(data).each(function () {
                        console.log(this.Nombre);
                        fnJS = this.Nombre
                    });
                }
    });

    return fnJS;
}

// convierte el código de la región si el país es Colombia, si es extranjero no muestra ningún nombre
function obtenerNombreDepartamento(pais, reg) {

    var fnJS = "";

    console.log("Pais:" + pais + " ---  Depto: " + reg)

    $.ajax({
        dataType: "json",
        url: 'http://poi.colombiajoven.gov.co/api/departamento/' + pais,
        async: false,
        success:
                function (data) {
                    $(data).each(function () {
                        var strId = this.ID;
                        console.log(strId);

                        if (strId == reg) {
                            console.log(this.Nombre);
                            fnJS = this.Nombre
                        }
                    });
                }
    });

    return fnJS;
}

function obtenerNombreCiudad(region, ciudad) {

    var fnJS = "";

    console.log("Departamento:" + region + " ---  Ciudad: " + ciudad)

    $.ajax({
        dataType: "json",
        url: 'http://poi.colombiajoven.gov.co/api/municipio/' + region,
        async: false,
        success:
                function (data) {
                    $(data).each(function () {
                        console.log(this.Nombre);
                        var strId = this.ID;
                        if (strId == ciudad) {
                            console.log(this.Nombre);
                            fnJS = this.Nombre
                        }
                    });
                }
    });
    return fnJS;
}

function filtrarOfertas(IdOferta, idModal) {

    $('#tmpAlgo').html('');

    var items = "";
    var retrievedObject = localStorage.getItem('TodaLaOferta');
    var data = JSON.parse(retrievedObject);

    $.each(data, function (i, val) {

        if (val.PkOferta === IdOferta) {

            var strFiltro = val.FechaInicio.indexOf("1900-01-01");

            var img = seccionIMG(val.FkSeccion);

            items = items + "<div data-role='popup' id='" + val.PkOferta + "_" + idModal + "' data-theme='b' style='top: 0%; left: 0%; right: 0%; width: 100%; height: 100%; position: fixed; overflow-y:auto; overflow-x:hidden; background-color:rgba(0, 0, 0, 0.80); display:none; z-index:1000'>";
            items = items + "<center><img src='img/ico/" + img + "' style='max-width:25%; margin:5% 1px; ' /></center>";
            items = items + "<h2 style='text-wrap:normal; text-align:center; color:white; border-color:transparent'>" + val.Oportunidad + "</h2>";
            items = items + "<div data-role='collapsible-set' id='" + val.PkOferta + "_CSet' data-mini='true' class='ui-nodisc-icon ui-alt-icon' data-theme='a' style='width: 90%; margin-left:5%; margin-right:5%;'>";
            items = items + "<div data-role='collapsible' data-collapsed='false'>";
            items = items + "<h3>Información</h3>";
            //items = items + "<p style='text-wrap:normal; text-align:center'><b>" + val.Seccion + "</b></p>";
            items = items + "<p style='text-wrap:normal; text-align:justify'>" + val.Informacion + "</p>";
            items = items + "</div>";
            items = items + "<div data-role='collapsible'>";
            items = items + "<h3>Entidad</h3>";
            items = items + "<p style='text-wrap:normal'><b>Nombre: </b>" + val.EntidadNombre + "</p>";
            items = items + "<p style='text-wrap:normal'><b>Contacto: </b><a href='#' id='btnContacto" + val.PkOferta + "_" + idModal + "' >" + val.Contacto + "</a></p>";
            items = items + "<p style='text-wrap:normal'><b>Web: </b><a href='#' id='btnEntidad" + val.PkOferta + "_" + idModal + "' >" + val.EntidadUrl + "</a></p>";
            items = items + "</div>";
            items = items + "<div data-role='collapsible'>";
            items = items + "<h3>Requisitos</h3>";
            items = items + ("<p style='text-wrap:normal; text-align:justify'>" + (val.Requisitos != "N/A" ? val.Requisitos : "<b>Ninguno</b>") + "</p>");
            items = items + "<p style='text-wrap:normal'><b>Población Objetivo: </b>" + val.PoblacionObjetivo + "</p>";

            if (val.EdadMinima == 0 || val.EdadMaxima == 0) {
                items = items + "<p style='text-wrap:normal'><b>Edad: </b> 14 - 28</p>";
            }
            else {
                items = items + "<p style='text-wrap:normal'><b>Edad: </b>" + val.EdadMinima + " - " + val.EdadMaxima + "</p>";
            }

            if (strFiltro != 0) {
                items = items + "<p style='text-wrap:normal'><b>Fecha Inicio (A/M/D): </b>" + mostrarCorrectamenteFecha(val.FechaInicio) + "</p>";
                items = items + "<p style='text-wrap:normal'><b>Fecha Fin (A/M/D): </b>" + mostrarCorrectamenteFecha(val.FechaFin) + "</p>";
            }
            else {
                items = items + "<p style='text-wrap:normal'><b>Oferta Permanente</b></p>";
            }

            items = items + "</div>";
            items = items + "<div data-role='collapsible'>";
            items = items + "<h3 id='btnVerUbicacion" + val.PkOferta + "_" + idModal + "' >Ubicación</h3>";
            items = items + "<p style='text-wrap:normal'><b>País:   </b><span id='lblPais" + val.PkOferta + "_" + idModal + "'>No Disponible</span></p>";
            items = items + "<p style='text-wrap:normal'><b>Región: </b><span id='lblRegion" + val.PkOferta + "_" + idModal + "'>No Disponible</span></p>";
            items = items + "<p style='text-wrap:normal'><b>Ciudad: </b><span id='lblCiudad" + val.PkOferta + "_" + idModal + "'>No Disponible</span></p>";
            items = items + "</div>";
            items = items + "</div>";
            items = items + "<div data-role='navbar' id='" + val.PkOferta + "_" + idModal + "' class='ui-nodisc-icon' style='margin:1% 5%;'>";
            items = items + "<ul data-mini='true'>";
            items = items + "<li><a href='#'data-theme='b' style='border: none; margin: 1px 5%; background-color: rgba(0, 128, 0, 0.80); ' data-icon='check' id='li_abrirLink" + val.PkOferta + "_" + idModal + "'>Ver más</a></li>";
            items = items + "<li><a href='#' data-theme='b' class='ui-btn' style='border: none; margin: 1px 5%; background-color: rgba(0, 148, 255, 0.80);' data-icon='comment' id='li_CompartirRedes" + val.PkOferta + "_" + idModal + "' >Compartir</a></li>";
            items = items + "<li id='li_cerrar" + val.PkOferta + "_" + idModal + "'><a href='#' data-theme='b' style='border: none; margin: 1px 5%; background-color: rgba(139, 0, 0, 0.80); ' data-icon='delete' data-rel='back'>Cerrar</a></li>";
            items = items + "</ul>";
            items = items + "</div>";
            items = items + "</div>";
            items = items + "<script> $('#li_cerrar" + val.PkOferta + "_" + idModal + "').click(function () {  $('#" + val.PkOferta + "_" + idModal + "').css('display', 'none');});</script>";

            items = items + "<script> $('#btnVerUbicacion" + val.PkOferta + "_" + idModal + "').click(function () { ";
            items = items + "$('#lblPais" + val.PkOferta + "_" + idModal + "').text(convertirNPais(" + val.FkPais + "));";
            items = items + "$('#lblRegion" + val.PkOferta + "_" + idModal + "').text(obtenerNombreDepartamento(" + val.FkPais + ", " + val.FkRegion + "));";
            items = items + "$('#lblCiudad" + val.PkOferta + "_" + idModal + "').text(obtenerNombreCiudad(" + val.FkRegion + ", " + val.FkCiudad + "));";
            items = items + "});</script>";

            items = items + "<script> $('#li_abrirLink" + val.PkOferta + "_" + idModal + "').click(function () {";
            items = items + "var strLinkAbrir = 'LINK_" + val.UrlFuente + "';";
            items = items + "try {AndroidFunctionToast.showToast(strLinkAbrir);}catch (err) {alert(strLinkAbrir);}";
            items = items + "}); </script>";

            items = items + "<script> $('#btnContacto" + val.PkOferta + "_" + idModal + "').click(function () {";
            items = items + "var strLinkAbrir = 'LINK_" + val.Contacto + "';";
            items = items + "try {AndroidFunctionToast.showToast(strLinkAbrir);}catch (err) {alert(strLinkAbrir);}";
            items = items + "}); </script>";

            items = items + "<script> $('#btnEntidad" + val.PkOferta + "_" + idModal + "').click(function () {";
            items = items + "var strLinkAbrir = 'LINK_" + val.EntidadUrl + "';";
            items = items + "try {AndroidFunctionToast.showToast(strLinkAbrir);}catch (err) {alert(strLinkAbrir);}";
            items = items + "}); </script>";


            items = items + "<script> $('#li_CompartirRedes" + val.PkOferta + "_" + idModal + "').click(function () {";
            console.log(val.Oportunidad.trim());
            items = items + "var testVal = 'TWITTER_LOGIN_Esto lo encontré en la App #SiJoven y te puede interesar: " + val.Oportunidad.trim() + ". <br>Entidad: " + val.EntidadNombre + ". <br>Más información: " + val.UrlFuente.trim() + "';";
            items = items + "try {AndroidFunctionToast.showToast(testVal);}catch (err) {alert(testVal);}";
            items = items + "}); </script>";

        }
    });

    items = items + "";

    var container = document.getElementById("tmpAlgo");
    $(container).append(items)

    $("div[id$='Pref']").popup();
    $("div[id$='_CSet']").collapsibleset();
    $("div[id$='_" + idModal + "']").navbar();

    $("#" + IdOferta + "_" + idModal).css('display', 'block');

    window.location.hash = "#ModalAbierto_" + IdOferta + "_" + idModal;

}

function obtenerFechaActual() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var today = dd + '/' + mm + '/' + yyyy;
    return today;
}
