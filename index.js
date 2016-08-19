let { Map, Range, List } = Immutable;

let createNodes = (node, levels) => Map({
  node: node,
  nodes: levels
    ? Range(0, Math.random()*2)
        .map(_ => createNodes(node + 1, levels - 1))
        .toList()
    : List([])
});

let data = immstruct(createNodes(0, 4));

let mixin = {
  shouldComponentUpdate: function () {
    this.didUpdate = omniscient.shouldComponentUpdate.apply(this, arguments);
    return true;
  }
};

let Node = React.createClass({

  mixins: [mixin],

  render: function () {
    let css = {
      backgroundColor: this.didUpdate ? '#3498DB' : '',
      color: this.didUpdate ? 'white' : '',
      padding: '0 0.2rem',
      margin: '0.3rem'
    };
    let data = this.props.data;
    let onClick = _ => data.updateIn(['node'], node => node + 1);
    return <li>
      <span style={css} onClick={onClick}>Node {data.get('node')}</span>
      <ul>
      {data.cursor('nodes').toArray().map(data =>
        <Node data={data} />)}
      </ul>
    </li>;
  }
});

var el = document.querySelector('.graph');
const render = () => React.render(<Node data={data.cursor()} />, el);
data.on('swap', render);
render();
