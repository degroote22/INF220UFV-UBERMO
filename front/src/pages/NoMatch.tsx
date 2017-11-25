import * as React from "react";
import * as rtr from "react-router-dom";
const { Redirect } = rtr;

class NoMatch extends React.Component<{}, { redirect: boolean }> {
  state = { redirect: false };
  redirect = () => this.setState({ redirect: true });
  componentDidMount() {
    if (!this.state.redirect) setTimeout(this.redirect, 1000);
  }
  render() {
    if (this.state.redirect) return <Redirect to="/" />;
    return <div>Página não encontrada, voltando à home...</div>;
  }
}

export default NoMatch;
