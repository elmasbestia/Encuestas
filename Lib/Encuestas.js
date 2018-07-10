// Librería JS par Encuestas

var   indicacion;
var   domPregunta    = {};
var   preguntas      = [];
var   Encuesta       = [];
var   preguntaActual = {};
const awe = clsAwesome();

const datEncuesta = {
    tipo: "FR6"
};

const datosEntorno = {
    puesto:	"Alcalde",
    dpt: {
        tipo: "Municipio",
        nombre: "Cajicá"
    },
    UNO:	4, // Falla si rota
    DOS:	2,
    TRES:	1,
    puesto2:	"al concejo",
    Candidatos:	[
        "Edilberto Afanador",
        "Orlando Díaz Canasto",
        "Fabio Ramírez",
        "Diego Jimenez",
        "Fabiola Jácome",
        "Angélica Perilla",
        "Richard Suarez"
    ],
    Partidos: [
        "Partido de la U",
        "Liberal",
        "Polo Democrático",
        "Centro Democrático",
        "Mira",
        "Cambio Radical",
        "Conservador",
        "Partido Verde",
        "Opción Ciudadana",
        "Mais",
        "ASI",
        "Ninguno"
    ],
    Problemas: [
        "Seguridad",
        "Recreación & Deporte",
        "Servicios Públicos",
        "Salud",
        "Desempleo",
        "Drogadicción",
        "Movilidad"
    ]
};
const Medios = [
    "Facebook",
    "Vallas",
    "Televisión local",
    "Correos electrónicos",
    "Periódico impreso",
    "Cartas",
    "Volantes",
    "Perifoneo"
];
const calificadores = {
    Imagen:  ["Favorable", "Desfavorable", "No le Conoce"],
    Gestion: ["Excelente", "Buena", "Mala", "Pésima"]
};

function rotar(opciones) {
    const marlon = () => Math.random()*opciones.length;
    return opciones.filter(a => a.rotar).sort((a,b) => marlon() > a ? -1 : 1);
}
function mst(dom) {
    let tabActivo = document.querySelector(".rogTabActivo");
    if(tabActivo) tabActivo.classList.remove("rogTabActivo");
    document.getElementById(dom).classList.add("rogTabActivo");
}
function mstIndicacion(msj) { indicacion.innerHTML = msj || ""; }

function iniEncuesta() {
    datEncuesta.inscrito = true;
    datEncuesta.genero = "";
    datEncuesta.edad = "";
    datEncuesta.sector = "";
    datEncuesta.encuestador = "";
    datEncuesta.supervisor = "";
    datEncuesta.identificada = false;
    datEncuesta.completa = false;
    datEncuesta.tipo = "FR6",
    datEncuesta.dpt = (datosEntorno.dpt);
    
    moveCorresponding(datEncuesta,"frmIdentifica")
    
    preguntas = [];

    domPregunta.ultima = -1;
    domPregunta.nro    = -1;
    
    mstIdentifica();
}

function nueva() {  // Nueva Encuesta
    if(datEncuesta.completa) {
        iniEncuesta();
    } else {
        alert("No ha completado la presente Encuesta");
    }
}

function identificar() {
    // Datos de la Encuesta
    datEncuesta.inscrito = evalRadio("inscrito");
    datEncuesta.genero = evalRadio("genero");
    datEncuesta.edad = valDom("edad");
    datEncuesta.sector = valDom("sector");
    datEncuesta.encuestador = valDom("encuestador");
    datEncuesta.supervisor = valDom("supervisor");

    let retorno = true;
    let x;
    for(x in datEncuesta) {
        if(!((x === "supervisor")||(x === "completa")||(x === "identificada"))) {
            retorno = retorno && Boolean(datEncuesta[x]);
        }
    }
    datEncuesta.identificada = retorno;
    return retorno;
}

function cargaEncuesta() {
//           leeJson(nbEncuesta, (datos) => {
//                Encuesta = datos;
        mstPregunta();
//            });
}
function mstIdentifica() {
    mstIndicacion("Buenos días/tardes, mi nombre es ________ Trabajo para AD CONSULTORES, empresa dedicada a conocer, a través de encuestas, la opinión de personas como usted acerca de diferentes temas.<br/>Valoramos su tiempo y esta encuesta solo debería tardar aproximadamente 10 minutos.<br/>No requerimos su nombre o identificación y sus respuestas serán tratadas con estricta confidencialidad solo para análisis estadístico.<br/>Si desea confirmar la veracidad de este estudio puede comunicarse al teléfono: <strong>301 4105814</strong>.");
    mst("datEncuesta");
}
function mstEncuesta() {
    if(datEncuesta.identificada || identificar()) mst("encuesta");
    else alert("Debes completar los datos de identificación de la encuesta");
}
function mstFinale() {
    indicacion.innerHTML = "";
    mstResultados();
    mst("finale");
}

function mstResultados() {
    let dom = objDom("divRespuestas");
    const nsnc = "NS/NC";

    function respuestaCompleta(pregunta) {
        return pregunta.respuesta ?
            pregunta.respuesta instanceof Array ?
            pregunta.respuesta.map((x,i) => ({ valor: x, txt: pregunta.opciones[i] }) )
            : { valor: pregunta.respuesta, txt: pregunta.opciones[pregunta.respuesta -1] }
            : nsnc;
    }

    dom.innerHTML =
        "Inscrito    : " + datEncuesta.inscrito    +"<br/>"+
        "Género      : " + datEncuesta.genero      +"<br/>"+
        "Edad        : " + datEncuesta.edad        +"<br/>"+
        "Sector      : " + datEncuesta.sector      +"<br/>"+
        "Encuestador : " + datEncuesta.encuestador +"<br/>"+
        "Supervisor  : " + datEncuesta.supervisor  +"<br/><br/>"+

        "Identificada: " + (datEncuesta.Identificada ? "Si" : "No") +"<br/>"+
        "Completa    : " + (datEncuesta.completa     ? "Si" : "No");

    dom.appendChild(document.createElement("HR"));
    // Respuestas
    let resultados = preguntas.map((x,i) =>
        ({ Nro: x.Nro,
           respuesta: respuestaCompleta(x)
        })
    );
    dom.innerHTML += resultados.map((x,i) =>
        i+". "+x.Nro +": " +
            (x.respuesta === nsnc ? nsnc :
            x.respuesta instanceof Array ?
                x.respuesta.map(x =>
                    "....." + x.valor +" => " +x.txt
                    ).join("<br/>") :
                x.respuesta.valor +" => " +x.respuesta.txt)
        ).join("<br/>");
    
    if(datEncuesta.completa && !datEncuesta.Registrada) registra(datEncuesta,resultados);
}

function responder(valor,nro) {
    preguntaActual.respuesta = valor;
    siguiente();
}

function evalua(e) {
    if(e) {
        let que = e.currentTarget;
        switch(que.id) {
            case "NSNC": responder(0);
                break;
            case "combo":
                let xOpcion = parseInt(que.value)-1;
                let opcion = que.children[xOpcion];
                if(opcion.textContent === "(libre)") preguntaActual.opciones[xOpcion] = prompt("Tipea tu respuesta, por favor");
                responder(que.value);
                break;
            default:
                // Evalua las categorizaciones
                let tabla = calificadores[preguntaActual.tipoResp]
                let respuestas = Array.from(document.querySelectorAll(".respRadio"))
                .map(x => {
                    let retorno;
                    Array.from(x.children).forEach(x => {
                        if(x.checked) retorno = tabla[x.value];
                    });
                    return retorno;
                });
                if(respuestas.includes(undefined)) alert("¡No deje respuestas en blanco!");
                else responder(respuestas);
        }
    }
}

function proximaPregunta(nro) {
    // Opciones:
    // 1. Siguiente elemento en el arreglo Preguntas
    //    Si no quedan elementos en Preguntas:
    // 2. El siguiente elemento de la Encuesta:
    // 		Si es un arreglo: depende entonces de la respuesta anterior: Si la respuesta anterior
    //      Si no quedan elementos en la Encuesta:
    // 3. devuelve undefined

    let pregunta = preguntaActual;

    if(nro >= preguntas.length) {
        if(nro < Encuesta.length) {
            preguntas.push(Encuesta[nro]);
            pregunta = preguntas[preguntas.length -1];
        } else
            datEncuesta.completa = true;
    } else {
        pregunta = preguntas[nro];
    }

    if(pregunta) {
        if(pregunta instanceof Array) {
            let x = preguntas[nro-1].respuesta;
            if(x = 0 || x >= pregunta.length) {
                pregunta = proximaPregunta(nro +1);
            } else {
                preguntas = preguntas.concat(pregunta);
            }
        }
    }

    return pregunta;
}

function mstPregunta(nro) {
    function llenaCmb(opciones) {
        domPregunta.combo.innerHTML = opciones.map((x,i) =>
           "<option value='" +(i+1)+"' class='opcion'>" +x +"</option>"
        ).join("");
        domPregunta.combo.size = opciones.length;
    }

    function llenaTabla(opciones,opcRespuestas) {
        function opcResp (opciones) {
            function identifica(i) {
                return retorno.replace(/%/g, i);
            }
            let retorno = "<spam class='respRadio'>"
            opciones.forEach((x,i) => {
                retorno += "<input type='radio' value='" +i+"' name='opc%'>" +x;
            });
            retorno += "</spam>";
            return identifica;
        }

        let wRespuesta = opcResp(opcRespuestas);

        domPregunta.tabla.innerHTML = opciones.map((x,i) =>
            "<tr><td class='opcion'>" + x +"</td><td>" +wRespuesta(i) +"</td></tr>"
        ).join("");
    }

    preguntaActual = proximaPregunta(nro === undefined ? nro = domPregunta.nro +1 : nro);
    if(datEncuesta.completa)
        mstFinale();
    else {
        domPregunta.nro            = nro;
        domPregunta.wNro.innerHTML = preguntaActual.Nro;
        domPregunta.txt.innerHTML  = preguntaActual.Pregunta;

        indicacion.innerHTML = preguntaActual.indicacion;

        if (preguntaActual.tipoResp) {
            llenaTabla(preguntaActual.opciones, calificadores[preguntaActual.tipoResp]);
            if(preguntaActual.respuesta) {
                Array.from(document.querySelectorAll(".respRadio"))
                .forEach((x,i) => {
                    x.children[preguntaActual.respuesta[i]].checked = true;
                });
            }
            domPregunta.tabla.style.display = "Block";
            domPregunta.combo.style.display = "none";
        } else {
            llenaCmb(preguntaActual.opciones);
            domPregunta.tabla.style.display = "none";
            domPregunta.combo.style.display = "Block";
            if(preguntaActual.respuesta) domPregunta.combo.value = preguntaActual.respuesta;
        }

        if (preguntaActual.respuesta === undefined) {
            domPregunta.nsnc.className = awe.chequear.no;
        } else {
            if(pregunta.respuesta) {
                domPregunta.nsnc.className = awe.chequear.no;
            } else {
                domPregunta.nsnc.className = awe.chequear.si;
                domPregunta.NSNC.className = "nsncActivo";
            }
        }
    }
}

function siguiente() { mstPregunta(domPregunta.nro +1) }

function anterior() { if(domPregunta.nro) mstPregunta(domPregunta.nro -1) }

function debut() {
    indicacion =  objDom("indicacion");
    domPregunta = {
        ultima: -1,
        nro:    -1,
        wNro:  objDom("nroPreg"),
        txt:   objDom("txt"),
        combo: objDom("combo"),
        tabla: objDom("tabla"),
        nsnc:  objDom("nsnc"),
        NSNC:  objDom("NSNC")
    }
    iniEncuesta();
    cargaEncuesta();

//            document.querySelector(".nueva").classList.add(awe.agrega)
    rogAsigna("#pregSig", "onclick",evalua);
    rogAsigna("#pregAnt", "onclick",anterior);
    rogAsigna("#NSNC",    "onclick",evalua);
    rogAsigna("#combo",   "oninput",evalua);
    
    iniFireBase();
}

// Ecrire au BD
function registra(encuesta,respuestas) {
    let idEncuesta = firebase.database().ref("AD/Encuestas").push().key;
    alert("Encuesta Nro. " + idEncuesta);

    firebase.database().ref("AD/Encuestas/"+idEncuesta).set(encuesta, (err) =>{
        if (err) 
            alert("¡Falló la creación de la Encuesta Nro " +idEncuesta+"!");
        else
            firebase.database().ref("AD/Respuestas/"+idEncuesta).set(respuestas, (err) => {
                if(err) alert("¡Falló el registro de las respuestas (Encuesta Nro. "+ idEncuesta+")!");
                else {
                    encuesta.fecha = new Date();
                    encuesta.Registrada = true;
                    encuesta.idEncuesta = idEncuesta;
                }
            });
    });
}
