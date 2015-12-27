
function item(props)
{
    return [
    `       <item>`,
    `          <guid>${props.link}</guid>`,
    `          <title>${props.title}</title>`,
    `          <link>${props.link}</link>`,
    `          <description>${props.desc}</description>`,
    `          <pudDate>${props.date.toISOString()}</pudDate>`,
    `       </item>`
    ].join('\n');
}

function body(props, items)
{
    return [
    `<rss version="2.0">`,
    `   <channel>`,
    `       <title>${props.title}</title>`,
    `       <link>${props.link}</link>`,
    `       <description>${props.desc}</description>`,
    `${items.map(i => item(i)).join("\n")}`,
    `   </channel>`,
    `</rss>`,
    ].join('\n');
}


module.exports = function(props, items)
{
    var xml = "";
    xml = body(props, items);
    return new Buffer(xml);
};