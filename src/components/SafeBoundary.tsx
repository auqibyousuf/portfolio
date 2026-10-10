import { Component, type ReactNode } from "react";

/** Swallows render and lazy-load failures so decorative or optional UI can never blank the whole page. */
export class SafeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
