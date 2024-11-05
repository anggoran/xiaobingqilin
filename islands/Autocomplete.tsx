import { Signal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

// Define the props interface for the Autocomplete component
interface AutocompleteProps {
  field: string; // Field name for the input
  endpoint: string; // API endpoint for fetching suggestions
  state: Signal; // Signal for state management
}

export default function Autocomplete(
  { props }: { props: AutocompleteProps },
) {
  // State management
  const [inputValue, setInputValue] = useState("");
  const [timeoutID, setTimeoutID] = useState<number | null>(null);
  const [showDatalist, setShowDatalist] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  /**
   * Handle input changes with debouncing
   * @param e - Input event
   */
  const handleChange = (e: JSX.TargetedEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setInputValue(value);

    // Update parent state
    props.state.value = { ...props.state.value, latin: value };
    setShowDatalist(false);

    // Clear existing timeout
    if (timeoutID) clearTimeout(timeoutID);

    // Set new timeout for debouncing
    if (value.trim()) {
      const newTimeoutID = setTimeout(() => {
        setShowDatalist(true);
      }, 500);
      setTimeoutID(newTimeoutID);
    }
  };

  /**
   * Fetch suggestions when showDatalist changes
   */
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!showDatalist || !inputValue.trim()) return;

      try {
        const response = await fetch(
          props.endpoint + encodeURIComponent(inputValue),
        );
        const data = await response.json();
        setSuggestions(data);
        setShowDatalist(true);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [showDatalist, inputValue]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          name={props.field}
          placeholder={props.field}
          list={showDatalist ? `${props.field}-list` : undefined}
          type="text"
          maxLength={6}
          value={inputValue}
          onInput={handleChange}
        />
        {/* Render datalist only when there are suggestions */}
        {showDatalist && suggestions.length > 0 && (
          <datalist id={`${props.field}-list`}>
            {suggestions.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
        )}
      </div>
    </div>
  );
}
