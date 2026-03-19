// docs/reqs/lib/ui-components.jsx — 両エディタ共通React UIコンポーネント
// <script type="text/babel" src="./lib/ui-components.jsx"></script> で読み込む
(function() {
const{useState,useRef,useCallback,useEffect}=React;
const{ZOOM_MIN,ZOOM_MAX,MAX_HISTORY,calcCenterPan}=window.__editorLib;

// M3 デザイントークン参照
const M3={
  primary:"var(--md-sys-color-primary)",onPrimary:"var(--md-sys-color-on-primary)",primaryContainer:"var(--md-sys-color-primary-container)",onPrimaryContainer:"var(--md-sys-color-on-primary-container)",
  surface:"var(--md-sys-color-surface)",surfaceContLow:"var(--md-sys-color-surface-container-low)",surfaceCont:"var(--md-sys-color-surface-container)",surfaceContHigh:"var(--md-sys-color-surface-container-high)",surfaceContHighest:"var(--md-sys-color-surface-container-highest)",
  onSurface:"var(--md-sys-color-on-surface)",onSurfaceVar:"var(--md-sys-color-on-surface-variant)",
  outline:"var(--md-sys-color-outline)",outlineVar:"var(--md-sys-color-outline-variant)",
  error:"var(--md-sys-color-error)",errorContainer:"var(--md-sys-color-error-container)",onErrorContainer:"var(--md-sys-color-on-error-container)",
  shapeSm:"var(--md-sys-shape-sm)",shapeMd:"var(--md-sys-shape-md)",shapeLg:"var(--md-sys-shape-lg)",shapeFull:"var(--md-sys-shape-full)",
  // model-editor が追加で使うトークン
  surfaceDim:"var(--md-sys-color-surface-dim)",shapeXs:"var(--md-sys-shape-xs)",
};

// フォーム入力
function Input({style,...p}){return<input{...p}style={{border:`1px solid ${M3.outlineVar}`,borderRadius:M3.shapeSm,background:M3.surface,color:M3.onSurface,fontSize:14,fontWeight:400,lineHeight:"20px",padding:"8px 16px",outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"inherit",...style}}onFocus={e=>{e.target.style.borderColor="#1A73E8";e.target.style.boxShadow="0 0 0 3px rgba(26,115,232,.12)";}}onBlur={e=>{e.target.style.borderColor="";e.target.style.boxShadow="none";}}/>;}

// セレクトボックス
function Sel({style,children,...p}){return<select{...p}style={{border:`1px solid ${M3.outlineVar}`,borderRadius:M3.shapeSm,background:M3.surface,color:M3.onSurface,fontSize:14,fontWeight:400,lineHeight:"20px",padding:"8px 16px",outline:"none",fontFamily:"inherit",...style}}>{children}</select>;}

// ボタン
function Btn({children,onClick,accent,small,danger,ghost}){
  const bg=danger?M3.errorContainer:accent?"#1A73E8":ghost?"transparent":M3.surfaceCont;
  const fg=danger?M3.onErrorContainer:accent?M3.onPrimary:ghost?"#1A73E8":M3.onSurface;
  const bd=ghost?`1px solid ${M3.outlineVar}`:"none";
  return<button onClick={onClick}style={{background:bg,border:bd,color:fg,borderRadius:M3.shapeFull,padding:small?"8px 16px":"8px 24px",fontSize:14,fontWeight:500,lineHeight:"20px",letterSpacing:"0.1px",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",transition:"box-shadow .15s, background .15s"}}onMouseEnter={e=>{e.target.style.boxShadow="var(--md-sys-elevation-1)";}}onMouseLeave={e=>{e.target.style.boxShadow="none";}}>{children}</button>;
}

// セクションラベル
const SLabel=({children})=><div style={{fontSize:12,fontWeight:500,lineHeight:"16px",letterSpacing:"0.5px",color:M3.onSurfaceVar,textTransform:"uppercase",marginBottom:8}}>{children}</div>;

// 初期パン位置計算フック
function useInitialPan(items,iw,ih,loadGenRef){
  const svgRef=useRef();
  const[pan,setPan]=useState({x:0,y:0});
  const lastGen=useRef(-1);
  useEffect(()=>{
    const gen=loadGenRef.current;
    if(lastGen.current===gen||!items||items.length===0||!svgRef.current)return;
    requestAnimationFrame(()=>{
      if(!svgRef.current)return;
      const r=svgRef.current.getBoundingClientRect();
      if(!r.width||!r.height)return;
      const c=calcCenterPan(items,iw,ih);
      setPan({x:c.cx-r.width/2,y:c.cy-r.height/2+40});
      lastGen.current=gen;
    });
  },[items,iw,ih]);
  return{svgRef,pan,setPan};
}

// ズームコントロール（3ボタン: −, %, +）
function ZoomControls({svgRef,zoom,setZoom,pan,setPan}){
  const zoomBy=(factor)=>{const r=svgRef.current?.getBoundingClientRect();if(!r)return;const cx=r.width/2,cy=r.height/2;setZoom(z=>{const nz=Math.min(ZOOM_MAX,Math.max(ZOOM_MIN,z*factor));const wx=cx/z+pan.x,wy=cy/z+pan.y;setPan({x:wx-cx/nz,y:wy-cy/nz});return nz;});};
  const reset=()=>{const r=svgRef.current?.getBoundingClientRect();if(!r)return;const cx=r.width/2,cy=r.height/2;setZoom(z=>{const wx=cx/z+pan.x,wy=cy/z+pan.y;setPan({x:wx-cx,y:wy-cy});return 1;});};
  const btnStyle={width:28,height:28,border:"none",background:"transparent",cursor:"pointer",fontSize:16,color:"#5F6368",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"};
  const hover=e=>{e.target.style.background="#F5F5F5";};
  const leave=e=>{e.target.style.background="transparent";};
  return<div style={{position:"absolute",bottom:16,right:16,display:"flex",alignItems:"center",gap:4,background:"white",borderRadius:"var(--md-sys-shape-full)",padding:"4px 8px",boxShadow:"var(--md-sys-elevation-1)"}}>
    <button onClick={()=>zoomBy(0.8)} style={btnStyle} onMouseEnter={hover} onMouseLeave={leave}>−</button>
    <button onClick={reset} style={{minWidth:48,height:28,border:"none",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:500,color:"#5F6368",borderRadius:14,fontFamily:"inherit"}} onMouseEnter={hover} onMouseLeave={leave}>{Math.round(zoom*100)}%</button>
    <button onClick={()=>zoomBy(1.25)} style={btnStyle} onMouseEnter={hover} onMouseLeave={leave}>+</button>
  </div>;
}

// 履歴管理フック
function useHistory(initial,showToast){
  const[data,setDataRaw]=useState(initial);
  const histRef=useRef({stack:[initial],idx:0});
  const dirtyRef=useRef(false);

  const setData=useCallback(updater=>{
    dirtyRef.current=true;
    setDataRaw(prev=>{
      const next=typeof updater==='function'?updater(prev):updater;
      const h=histRef.current;
      h.stack=h.stack.slice(0,h.idx+1);
      h.stack.push(JSON.parse(JSON.stringify(next)));
      if(h.stack.length>MAX_HISTORY){h.stack.shift();}else{h.idx++;}
      return next;
    });
  },[]);

  const setDataSilent=useCallback(updater=>{
    setDataRaw(prev=>typeof updater==='function'?updater(prev):updater);
  },[]);

  const undo=useCallback(()=>{const h=histRef.current;if(h.idx<=0)return;h.idx--;dirtyRef.current=true;setDataRaw(JSON.parse(JSON.stringify(h.stack[h.idx])));showToast('Undo');},[showToast]);
  const redo=useCallback(()=>{const h=histRef.current;if(h.idx>=h.stack.length-1)return;h.idx++;dirtyRef.current=true;setDataRaw(JSON.parse(JSON.stringify(h.stack[h.idx])));showToast('Redo');},[showToast]);
  const reset=useCallback(newData=>{setDataRaw(newData);histRef.current={stack:[JSON.parse(JSON.stringify(newData))],idx:0};},[]);

  return{data,setData,setDataSilent,undo,redo,reset,histRef,dirtyRef};
}

window.__editorUI={M3,Input,Sel,Btn,SLabel,useInitialPan,ZoomControls,useHistory};
})();
