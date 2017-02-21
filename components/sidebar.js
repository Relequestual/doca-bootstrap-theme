const React = require('react');
const Component = require('react-pure-render/component');
const ImmutablePropTypes = require('react-immutable-proptypes');
const Nav = require('react-bootstrap/lib/Nav');
const Navbar = require('react-bootstrap/lib/Navbar');
const NavDropdown = require('react-bootstrap/lib/NavDropdown');
const MenuItem = require('react-bootstrap/lib/MenuItem');

class Sidebar extends Component {

  static propTypes = {
    schemas: ImmutablePropTypes.list.isRequired,
    config: React.PropTypes.object,
  };

  render() {
    const { schemas, config } = this.props;

    return (
      <Navbar collapseOnSelect className="navbar navbar-default navbar-fixed-side">
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">{config.title}</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
              {schemas.filter(schema => !schema.get('hidden')).valueSeq().map(schema =>
                <NavDropdown title={schema.get('title')} id="nav-dropdown" key={`${schema.get('title')}`} >
                    {schema.get('links').valueSeq().map(link =>
                    <MenuItem href={`#${link.get('html_id')}`} key={`${schema.get('title')}-${link.get('title')}`} >{link.get('title')}</MenuItem>
                    )}
                </NavDropdown>
              )}
           </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

}

module.exports = Sidebar;
