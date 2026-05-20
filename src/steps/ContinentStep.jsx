import React from "react";
import { Globe, HelpCircle } from "lucide-react";

import { CONTINENTS } from "../data/options.js";
import { G } from "../theme/gradients.js";
import { GHOST } from "../theme/colors.js";
import { Wrap } from "../components/Wrap.jsx";
import { StepHead } from "../components/StepHead.jsx";
import { Coverflow } from "../components/Coverflow.jsx";

export const CONT_GRAD = { europe: G.cobble, asia: G.neon, oceania: G.beach, americas: G.market };

export function ContinentStep({ setContinent, setSelected, setStep }) {
  return (
    <Wrap narrow>
      <StepHead kicker={<><Globe style={{ width: 13, height: 13 }} /> Step 3</>}
        title="Where in the world?"
        back={() => setStep("profile")} />

      <div className="fl" style={{ animationDelay: ".2s" }}>
        <Coverflow
          items={CONTINENTS}
          grads={CONT_GRAD}
          onPick={(id) => { setContinent(id); setSelected([]); setStep("images"); }}
        />
      </div>

      <button onClick={() => { setContinent("any"); setSelected([]); setStep("images"); }}
        className="pressable fl" style={{ ...GHOST, width: "100%", marginTop: 30, animationDelay: ".4s" }}>
        <HelpCircle style={{ width: 18, height: 18, color: "#7c4dff" }} /> Not sure? Show me a mix
      </button>
    </Wrap>
  );
}
