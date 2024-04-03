import { Signal } from "@preact/signals";

interface LabelProps {
  initial: Signal<string>;
  final: Signal<string>;
  tone: Signal<string>;
}

export function Label({ props }: { props: LabelProps }) {
  return <p>{`${props.initial}${props.final}${props.tone}`}</p>;
}
