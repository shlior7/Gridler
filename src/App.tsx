import React from "react";
import "./App.scss";
import { ToggleSwitch } from "./components";
import { Griddler, orientation } from "./components/Griddler/griddler";

export type AppState = {
  theme: string;
  reload: boolean; //reload page manually
  rows: number;
  cols: number;
};

export class App extends React.PureComponent<{}, AppState> {
  state: AppState = {
    theme: "light",
    reload: false,
    rows: 35,
    cols: 25,
  };
  ///sets theme of documents root using css
  setTheme = () => {
    if (this.state.theme === "light") {
      document.documentElement.style.setProperty("--color", "white");
      document.documentElement.style.setProperty("--background-color", "black");
      this.setState({ theme: "dark" });
    } else {
      document.documentElement.style.setProperty("--color", "black");
      document.documentElement.style.setProperty("--background-color", "white");
      this.setState({ theme: "light" });
    }
  };

  async componentDidMount() {}

  ReloadPage = () => {
    this.setState({ reload: true });
  };
  save = (name: string, left: number[][], up: number[][]) => {
    //api.save(name, left, up);
  };
  handleInputChange = (orient: number, value: number) => {
    if (orient === orientation.row) this.setState({ rows: value });
    else this.setState({ cols: value });
    this.ReloadPage();
  };
  render() {
    return (
      <div>
        <ToggleSwitch onChange={this.setTheme}></ToggleSwitch>
        <div className="page">
          <div className="inputBox">
            <label>Row Number:</label>
            <input
              placeholder="row number"
              onChange={(e) =>
                this.handleInputChange(
                  orientation.row,
                  parseInt(e.target.value)
                )
              }
            ></input>
            <label>column Number:</label>
            <input
              placeholder="column number"
              onChange={(e) =>
                this.handleInputChange(
                  orientation.col,
                  parseInt(e.target.value)
                )
              }
            ></input>
          </div>

          <Griddler
            rows={this.state.rows}
            cols={this.state.cols}
            save={(name, left, up) => this.save(name, left, up)}
            reload={this.ReloadPage}
          ></Griddler>
        </div>
      </div>
    );
  }
}
export default App;
