export function renderDocument(template, rendered, helmet) {
  const head = [helmet?.title, helmet?.meta, helmet?.link, helmet?.script].filter(Boolean).map((item) => item.toString()).join("\n");
  return template.replace("<div id=\"root\"></div>", `<div id="root">${rendered}</div>`).replace("</head>", `${head}</head>`);
}
