// VisualizadorABB.jsx - Versão corrigida

import { useState, useRef, useEffect } from "react";
import { Layer, Circle, Text, Line, Group, Rect } from "react-konva";
import Konva from "konva";
import { visualizarAbb } from "../../services/abbServices";
import PalcoZoom from "./PalcoZoom";

const VELOCIDADE_ANIMACAO = 1.2;
const RAIO = 24;
const ESPACO_VERTICAL = 75;
const MARGEM = 50;

function profundidade(no) {
  if (!no) return 0;
  return 1 + Math.max(profundidade(no.esq), profundidade(no.dir));
}

function posicoes(no, prof, esq, dir, acc = []) {
  if (!no) return acc;
  acc.push({ valor: no.valor, x: (esq + dir) / 2, prof });
  posicoes(no.esq, prof + 1, esq, (esq + dir) / 2, acc);
  posicoes(no.dir, prof + 1, (esq + dir) / 2, dir, acc);
  return acc;
}

function arestas(no, prof, esq, dir, acc = []) {
  if (!no) return acc;
  const px = (esq + dir) / 2;
  if (no.esq) {
    arestas(no.esq, prof + 1, esq, (esq + dir) / 2, acc);
    acc.push({
      pai: no.valor,
      filho: no.esq.valor,
      px,
      py: prof,
      cx: (esq + (esq + dir) / 2) / 2,
      cy: prof + 1,
    });
  }
  if (no.dir) {
    arestas(no.dir, prof + 1, (esq + dir) / 2, dir, acc);
    acc.push({
      pai: no.valor,
      filho: no.dir.valor,
      px,
      py: prof,
      cx: ((esq + dir) / 2 + dir) / 2,
      cy: prof + 1,
    });
  }
  return acc;
}

function NoABB({ x, y, valor, estado }) {
  const ref = useRef();
  const cores = { normal: "#f1f5f9", novo: "#bbf7d0", removendo: "#fecaca" };
  useEffect(() => {
    if (!ref.current) return;
    if (estado === "novo") {
      ref.current.scale({ x: 0, y: 0 });
      new Konva.Tween({
        node: ref.current,
        duration: VELOCIDADE_ANIMACAO,
        scaleX: 1,
        scaleY: 1,
        easing: Konva.Easings.EaseOut,
      }).play();
    }
    if (estado === "removendo") {
      new Konva.Tween({
        node: ref.current,
        duration: VELOCIDADE_ANIMACAO,
        scaleX: 0,
        scaleY: 0,
        opacity: 0,
        easing: Konva.Easings.EaseInOut,
      }).play();
    }
  }, [estado]);

  useEffect(() => {
    if (!ref.current) return;
    new Konva.Tween({
      node: ref.current,
      duration: VELOCIDADE_ANIMACAO,
      x,
      y,
      easing: Konva.Easings.EaseInOut,
    }).play();
  }, [x, y]);

  return (
    <Group ref={ref} x={x} y={y}>
      <Circle
        radius={RAIO}
        fill={cores[estado] || cores.normal}
        stroke="#64748b"
        strokeWidth={1.5}
      />
      <Text
        x={-RAIO}
        y={-RAIO}
        width={RAIO * 2}
        height={RAIO * 2}
        text={String(valor)}
        fontSize={13}
        fontFamily="monospace"
        fontStyle="bold"
        fill="#1e293b"
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
}

export default function ABBVisualizer() {
  const [arvore, setArvore] = useState(null);
  const [nosRenderizados, setNosRenderizados] = useState([]);
  const [nosRemovendo, setNosRemovendo] = useState(new Set());
  const [nosNovos, setNosNovos] = useState(new Set());
  const refContainer = useRef(null);
  const [largura, setLargura] = useState(600);
  const [altura, setAltura] = useState(500);

  const load = async () => {
    try {
      const r = await visualizarAbb();
      setArvore(r.data || null);
    } catch {
      setArvore(null);
    }
  };

  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const atualizar = () => {
      if (!refContainer.current) return;
      setLargura(refContainer.current.offsetWidth);
      setAltura(refContainer.current.offsetHeight);
    };
    atualizar();
    const obs = new ResizeObserver(atualizar);
    if (refContainer.current) obs.observe(refContainer.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const novos = arvore ? posicoes(arvore, 0, 0, 1) : [];
    const novosIDs = new Set(novos.map((n) => n.valor));
    const antigosIDs = new Set(nosRenderizados.map((n) => n.valor));
    const inseridos = [...novosIDs].filter((x) => !antigosIDs.has(x));
    const removidos = [...antigosIDs].filter((x) => !novosIDs.has(x));

    if (inseridos.length) {
      setNosNovos(new Set(inseridos));
      setTimeout(() => setNosNovos(new Set()), VELOCIDADE_ANIMACAO * 1000);
    }

    if (removidos.length) {
      setNosRemovendo(new Set(removidos));
      setTimeout(() => {
        setNosRenderizados(novos);
        setNosRemovendo(new Set());
      }, VELOCIDADE_ANIMACAO * 1000);
    } else {
      setNosRenderizados(novos);
    }
  }, [arvore]);

  const prof = profundidade(arvore);
  const edges = arvore ? arestas(arvore, 0, 0, 1) : [];
  const maxNosBase = Math.pow(2, Math.max(0, prof - 1));
  const espacoMinimo = maxNosBase * (RAIO * 3);
  const larguraDesenho = Math.max(largura, espacoMinimo);
  const offsetCentralizacao = (larguraDesenho - largura) / 2;

  const toCanvas = (xN, p) => ({
    x: MARGEM + xN * (larguraDesenho - MARGEM * 2) - offsetCentralizacao,
    y: 55 + p * ESPACO_VERTICAL,
  });

  // Verifica se a árvore está vazia
  const estaVazia = !arvore && nosRenderizados.length === 0;

  return (
    <div ref={refContainer} className="relative w-full h-full">
      <PalcoZoom width={largura} height={altura}>
        <Layer>
          <Rect
            x={-5000}
            y={-5000}
            width={largura + 10000}
            height={altura + 10000}
            fill="#ffffff"
          />

          {edges.map((e, i) => {
            const p = toCanvas(e.px, e.py);
            const c = toCanvas(e.cx, e.cy);
            return (
              <Line
                key={i}
                points={[p.x, p.y, c.x, c.y]}
                stroke="#64748b"
                strokeWidth={1.5}
              />
            );
          })}

          {nosRenderizados.map((n) => {
            const pos = toCanvas(n.x, n.prof);
            let estado = "normal";
            if (nosRemovendo.has(n.valor)) estado = "removendo";
            if (nosNovos.has(n.valor)) estado = "novo";
            return (
              <NoABB
                key={n.valor}
                x={pos.x}
                y={pos.y}
                valor={n.valor}
                estado={estado}
              />
            );
          })}

          {/* Mensagem centralizada quando a árvore estiver vazia - mesmo estilo da RN */}
          {estaVazia && (
            <Text 
              x={0} 
              y={altura / 2 - 10} 
              width={largura}
              text="Árvore Binária vazia — use o painel para inserir"
              fontSize={12} 
              fontFamily="monospace" 
              fill="#334155" 
              align="center" 
            />
          )}
        </Layer>
      </PalcoZoom>
    </div>
  );
}