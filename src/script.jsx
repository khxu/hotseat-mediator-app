import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function App() {
  // State variables
  const [step, setStep] = React.useState(0);
  const [startingNumber, setStartingNumber] = React.useState("");
  const [finalNumber, setFinalNumber] = React.useState("");
  const [intervalSkip, setIntervalSkip] = React.useState("");
  const [currentNumber, setCurrentNumber] = React.useState(0);
  const [plaintiffResponse, setPlaintiffResponse] = React.useState(null);
  const [defendantResponse, setDefendantResponse] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const [showInstructions, setShowInstructions] = React.useState(false);

  // Function to handle number input changes
  const handleNumberChange = (setter) => (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  // Function to start the mediation process
  const startMediation = () => {
    if (startingNumber && finalNumber && intervalSkip) {
      setCurrentNumber(parseInt(startingNumber));
      setStep(1);
    }
  };

  // Function to handle responses
  const handleResponse = (party, response) => {
    if (party === "plaintiff") {
      setPlaintiffResponse(response);
      setStep(2);
    } else {
      setDefendantResponse(response);
      checkResponses(response);
    }
  };

  // Function to check responses and decide next action
  const checkResponses = (defendantResponse) => {
    if (plaintiffResponse === "accept" && defendantResponse === "accept") {
      setResult(`Congratulations! Both parties have agreed to settle the case for $${currentNumber}.`);
      setStep(5);
    } else if (currentNumber >= parseInt(finalNumber)) {
      setResult("Unfortunately it does not appear the parties have any common ground.");
      setStep(5);
    } else {
      setCurrentNumber(currentNumber + parseInt(intervalSkip));
      setPlaintiffResponse(null);
      setDefendantResponse(null);
      setStep(1);
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!startingNumber || !finalNumber || !currentNumber) return 0;
    const total = parseInt(finalNumber) - parseInt(startingNumber);
    const current = currentNumber - parseInt(startingNumber);
    return (current / total) * 100;
  };

  // Render different components based on the current step
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4">Welcome to Hotseat Mediator</h2>
            <p className="mb-4">This program will determine if there is a number at which the parties are willing to settle the case.</p>
            <Button onClick={() => setShowInstructions(true)}>View Instructions</Button>
            <div className="mt-4">
              <Input
                type="text"
                placeholder="Starting dollar figure"
                value={startingNumber}
                onChange={handleNumberChange(setStartingNumber)}
                className="mb-2"
              />
              <Input
                type="text"
                placeholder="Ending dollar figure"
                value={finalNumber}
                onChange={handleNumberChange(setFinalNumber)}
                className="mb-2"
              />
              <Input
                type="text"
                placeholder="Interval for each jump"
                value={intervalSkip}
                onChange={handleNumberChange(setIntervalSkip)}
                className="mb-4"
              />
              <Button onClick={startMediation} disabled={!startingNumber || !finalNumber || !intervalSkip}>
                Start Mediation
              </Button>
            </div>
          </Card>
        );
      case 1:
      case 2:
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4">{step === 1 ? "Plaintiff's" : "Defendant's"} Turn</h2>
            <p className="mb-4">What is your response to ${currentNumber}?</p>
            <div className="w-full bg-neutral-3 rounded-full h-2.5 mb-4">
              <div className="bg-accent-9 h-2.5 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleResponse(step === 1 ? "plaintiff" : "defendant", "accept")}>Accept</Button>
              <Button onClick={() => handleResponse(step === 1 ? "plaintiff" : "defendant", "reject")}>Reject</Button>
            </div>
          </Card>
        );
      case 5:
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4">Result</h2>
            <p className="mb-4">{result}</p>
            <Button onClick={() => window.location.reload()}>Start Over</Button>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <SparkApp>
      <PageContainer maxWidth="small">
        {renderStep()}
        <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Instructions</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p>Both sides can indicate acceptance or rejection of a number without fear of losing bargaining position. If one side rejects a particular number, it will never know whether the other side accepted or rejected that number.</p>
              <br />
              <p>It is in both parties' interest to be honest with themselves. You do not benefit from posturing or artificially inflating or deflating demands/offers in this program.</p>
              <br />
              <p>If you are willing to accept a number, indicate so or else you may skip over the window of opportunity and the number at which a case can settle.</p>
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="primary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </SparkApp>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);

export default App;
