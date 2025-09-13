import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Plus, X, Download, AlertCircle, RefreshCw, Edit2 } from 'lucide-react';

const defaultEvaluationData = {
  "Solution Value and Fit": [
    {
      id: "SVF.1",
      attribute: "Language and Value Chain",
      question: "How well does the solution support local language(s) and value chain(s)?",
      answers: [
        "solution is available only in English and does not include local value chain(s)",
        "solution is available in the primary local language, but does not include any applicable value chains",
        "solution supports the primary local language and some applicable value chains",
        "solution supports 2+ local languages and applicable value chains",
        "solution supports local language(s) and dialects and includes all local value chains"
      ],
      defaultWeight: 10
    },
    {
      id: "SVF.2",
      attribute: "User Fit and Experience",
      question: "How user-friendly is the solution and well does it meet user needs and align with existing processes?",
      answers: [
        "complicated screens and workflows; solution meets only 1 user need and introduces several new processes",
        "complicated screens and workflows; solution meets most user needs, but introduces several new processes",
        "complicated screens, but intuitive workflows; solution meets most user needs and introduces 1 new process",
        "clear, intuitive screens and workflows; solution meets all user needs and introduces 1 new process",
        "clear, intuitive screens and workflows; solution meets all user needs and closely follows existing processes"
      ],
      defaultWeight: 10
    },
    {
      id: "SVF.3",
      attribute: "Market Fit",
      question: "What is the level of market traction of the solution? Consider active users (not registered or downloads).",
      answers: [
        "country, but not local presence; no in-country support team, <100 monthly active users (MAU)",
        "country, but not local presence; in-country support team, <1,000 MAU",
        "local presence; in-country support team, <10,000 MAU",
        "local presence; local support team; <100,000 MAU",
        "local presence; local support team; >100,000 MAU"
      ],
      defaultWeight: 10
    },
    {
      id: "SVF.4",
      attribute: "Value Chain Experience",
      question: "How much user, value chain and/or domain expertise does the software vendor have?",
      answers: [
        "no value-chain expertise; no domain experts in-house; no experience with this user population",
        "limited value-chain expertise; no domain experts in-house; no experience with this user population",
        "moderate value-chain expertise; no domain experts in-house; moderate experience with this user population",
        "extensive value-chain expertise; no domain experts in-house; moderate experience with this user population",
        "extensive value-chain expertise; domain experts in-house; significant experience with this user population"
      ],
      defaultWeight: 10
    },
    {
      id: "SVF.5",
      attribute: "Customizability",
      question: "How customizable is the solution and how willing is the software vendor to customize it for your project's needs?",
      answers: [
        "difficult to customize and vendor is not willing to change it",
        "somewhat customizable; vendor willing to customize but quotes very high customization cost",
        "moderately customizable; vendor willing to customize if fully reimbursed for expenses",
        "highly customizable; vendor highly willing to collaborate and discount customization expenses",
        "highly customizable; vendor highly willing to collaborate and willing to cover customization expenses"
      ],
      defaultWeight: 10
    },
    {
      id: "SVF.6",
      attribute: "Ease of Integration",
      question: "How easily does the solution integrate with other software?",
      answers: [
        "very difficult to integrate; proprietary data format; difficult to move data in/out; no APIs available",
        "considerable integration effort; proprietary data format; data easy to move in/out; few APIs available",
        "medium integration effort; industry-standard data format; data easy to move in/out; some APIs available",
        "easy to integrate, industry-standard data format; data easy to move in/out; many APIs available",
        "very easy to integrate; industry-standard data format; fully available and documented APIs"
      ],
      defaultWeight: 10
    },
    {
      id: "SVF.7",
      attribute: "Data Stewardship and Protection",
      question: "Who owns the data, how do users provide consent and how are data protected?",
      answers: [
        "company owns data; general user agreement; no Access Control Lists (ACLs)",
        "company owns data; basic data consent form; basic cloud provider security; no ACLs",
        "users own data; users provide consent for each use; basic cloud provider security; no ACLs",
        "users own data; clear mechanism to provide and withdraw data consent; enhanced cloud security; basic ACLs",
        "users own data; clear mechanism to provide and withdraw data consent; enhanced cloud security; extensive ACLs; two-factor authentication"
      ],
      defaultWeight: 10
    },
    {
      id: "SVF.8",
      attribute: "Performance",
      question: "How well has the solution been performance-tested?",
      answers: [
        "no claims or performance test documentation; solution does not auto-scale",
        "tested with 100s of users; minimum documentation available; does not auto-scale",
        "tested with 1000s of users; significant documentation available; does not auto-scale",
        "tested with 100,000+ users via standard benchmark; detailed results available; auto-scales",
        "tested with 1m+ users via standard benchmark; detailed results available; auto-scales"
      ],
      defaultWeight: 10
    },
    {
      id: "SVF.9",
      attribute: "Gender and Ability Inclusivity",
      question: "How inclusive is the solution experience for all genders and abilities?",
      answers: [
        "highly exclusive, solution experience is centered on one gender and ability level",
        "somewhat exclusive, experience exhibits some gender biases and no consideration for different abilities",
        "moderately inclusive, experience shows effort to address gender biases and provides some accommodation for different abilities",
        "quite inclusive, experience actively addresses gender biases and provides significant accommodation for different abilities",
        "highly inclusive, solution is expressly designed to accommodate all genders and abilities"
      ],
      defaultWeight: 10
    },
    {
      id: "SVF.10",
      attribute: "Youth",
      question: "How well does the solution involve youth?",
      answers: [
        "minimal avenues for youth involvement; no mechanism for their feedback; does not create additional opportunities for youth",
        "youth are one of several user groups, but have no way to influence solution; no additional youth opportunities created",
        "youth are the main user group and can easily submit feedback; no additional youth opportunities created",
        "youth are the main user group and can easily submit feedback; solution creates some additional opportunities for youth",
        "solution is specifically designed by and for youth; they play significant role in shaping it; it creates significant additional opportunities for them"
      ],
      defaultWeight: 10
    }
  ],
  "Implementation Cost and Sustainability": [
    {
      id: "ICS.1",
      attribute: "Development and Test",
      question: "How high will initial development or customization and (internal) testing costs be?",
      answers: [
        "high development and customization costs; many new features and changes required; no existing testing plan",
        "moderate development and customization costs; some new features and changes required; no existing testing plan",
        "no new development and moderate customization costs; no new features and some changes required; basic testing plan",
        "no new development and low customization costs; no new features and minimal changes required; detailed testing plan",
        "no new development or customization costs; no new features or changes required; detailed and automated testing plan"
      ],
      defaultWeight: 10
    },
    {
      id: "ICS.2",
      attribute: "Ongoing Operation and Updates",
      question: "How high will ongoing operation and periodic software update costs be?",
      answers: [
        "high operation costs; no economies of scale with user growth; vendor will charge for new versions and updates",
        "moderate operation costs; no economies of scale with user growth; vendor will charge for new versions and updates",
        "moderate operation costs; some economies of scale with user growth; vendor will charge for new versions, but not updates",
        "low operation costs; high economies of scale with user growth; vendor will charge for new versions, but not updates",
        "low operation costs; high economies of scale with user growth; no charge for new versions and updates"
      ],
      defaultWeight: 10
    },
    {
      id: "ICS.3",
      attribute: "Onboarding and Documentation",
      question: "How easy is user onboarding and how much documentation is available for users?",
      answers: [
        "multi-step onboarding process; no support for user import; no additional user documentation available",
        "multi-step onboarding process; limited user import support; in-system documentation only",
        "multi-step onboarding process; easy user import; in-system documentation only",
        "simple onboarding process; easy user import; in-system documentation only",
        "simple onboarding process; easy user import; in-system and offline user documentation available"
      ],
      defaultWeight: 10
    },
    {
      id: "ICS.4",
      attribute: "Training Effort",
      question: "How much training is required to deploy the solution?",
      answers: [
        "high effort, requires high travel and equipment resources and many training sessions",
        "moderate-high effort, requires significant travel and equipment resources and several training sessions",
        "moderate effort, requires a reasonable amount of travel and equipment resources and 2 training sessions",
        "moderate-low effort, requires limited travel and equipment resources and 1 training session",
        "low effort, requires minimal travel and equipment resources and 1 brief training session"
      ],
      defaultWeight: 10
    },
    {
      id: "ICS.5",
      attribute: "Extension Workers",
      question: "How much follow-up by extension workers (field facilitators) is required to retain active users?",
      answers: [
        "high effort, requires monthly in-person follow-up visits",
        "moderate-high effort, requires quarterly in-person follow-up visits",
        "moderate effort, requires annual in-person follow-up visits",
        "moderate-low effort, requires 2 in-person follow-up visits total",
        "low effort, requires 1 in-person follow-up visit total"
      ],
      defaultWeight: 10
    },
    {
      id: "ICS.6",
      attribute: "User Acquisition and Scaling",
      question: "How costly is it to acquire new users and how scalable is the solution?",
      answers: [
        "high user acquisition cost; solution needs updates to scale to other areas; vendor not ready to support new areas",
        "moderate user acquisition cost; solution needs updates to scale to other areas; vendor not ready to support new areas",
        "low user acquisition cost; solution needs updates to scale to other areas; vendor not ready to support new areas",
        "low user acquisition cost; solution can scale to other areas today; vendor planning to support new areas",
        "low user acquisition cost; solution can scale to other areas today; vendor already operating in target areas"
      ],
      defaultWeight: 10
    },
    {
      id: "ICS.7",
      attribute: "Partnership Readiness",
      question: "How ready is the software vendor in terms of securing industry, government or civil society partnerships and collaborations?",
      answers: [
        "no partnerships secured and limited collaboration opportunities",
        "few partnerships secured and modest collaboration opportunities",
        "some partnerships secured with already existing potential for collaboration",
        "several partnerships secured and established collaborations",
        "extensive network of secured partners with strong collaborations"
      ],
      defaultWeight: 10
    },
    {
      id: "ICS.8",
      attribute: "Sustainability",
      question: "How likely is the solution to be sustainable after project end?",
      answers: [
        "no clear business model or other sources of revenue, solution depends on nonprofit funding",
        "solution has a profitability plan with other sources of revenue, but is not profitable yet",
        "solution is already profitable through user revenue",
        "solution is already profitable through user and 1 other revenue source",
        "solution is already profitable through multiple revenue sources (user, advertisement, market actor, government, etc.)"
      ],
      defaultWeight: 10
    },
    {
      id: "ICS.9",
      attribute: "Break-Even Point",
      question: "When will the solution break even without project funding?",
      answers: [
        "vendor is not able to show a clear break-even model without project funding",
        "break-even point in 6-7 years",
        "break-even point in 4-5 years",
        "break-even point in 2-3 years",
        "solution is already profitable"
      ],
      defaultWeight: 10
    },
    {
      id: "ICS.10",
      attribute: "User Affordability",
      question: "How affordable is the solution to users?",
      answers: [
        "solution would never be affordable to users without project funding",
        "solution would be affordable to users without project funding, but only with government or other support",
        "solution would likely be affordable to users if it contributed to higher income",
        "solution would clearly be affordable to users if it contributed to higher income",
        "solution is affordable to users now"
      ],
      defaultWeight: 10
    }
  ],
  "Project Readiness": [
    {
      id: "PR.1",
      attribute: "Project Readiness",
      question: "How prepared is your project for implementing the solution?",
      answers: [
        "not ready, the project is in the early setup phase, and it is too soon for implementation with participants",
        "early setup, the project has been initiated, but participants are not yet actively engaged, and it is still early for implementation",
        "transitioning, the project is progressing, participants are becoming more engaged, and it is approaching readiness for implementation",
        "nearly ready, the program has reached project stage, participants are actively engaged, and it is ready for implementation with minor adjustments",
        "fully ready, the project is well-established, participants are fully engaged, and it is ready for immediate implementation"
      ],
      defaultWeight: 20
    },
    {
      id: "PR.2",
      attribute: "Budget Availability",
      question: "What is the budget availability for implementing and sustaining the solution?",
      answers: [
        "no availability, other sources of funding would need to be secured to implement",
        "little availability, funds could be pulled from other budgets to start design, but implementation would have to wait",
        "moderate availability, there's a modest planned budget and little incoming grant(s) and/or investment(s)",
        "high availability, there's meaningful budget for this initiative and likely incoming grant(s) and/or investment(s)",
        "exceptional availability, there's significant budget plus secured grant(s) and/or investment(s)"
      ],
      defaultWeight: 20
    },
    {
      id: "PR.3",
      attribute: "User Excitement",
      question: "What is the level of user demand and eagerness to participate and use the solution?",
      answers: [
        "low user eagerness, limited demand and enthusiasm from users to participate and use the solution",
        "moderate user eagerness, some demand and interest from users",
        "fairly high user eagerness, significant demand and enthusiasm from users",
        "high user eagerness, strong demand and excitement from users",
        "exceptional user eagerness, expressions of willingness to pay for the solution"
      ],
      defaultWeight: 20
    },
    {
      id: "PR.4",
      attribute: "Digital Literacy",
      question: "What is the level of digital literacy, digital service access and willingness among users?",
      answers: [
        "very low digital literacy; no access to digital services beyond social media; resistance towards digital tools",
        "low digital literacy; minimal access to digital services; could be convinced to use digital tools in their work",
        "moderate digital literacy; some access to digital services; could be convinced to use digital tools in their work",
        "high digital literacy; moderate access to digital services; moderate willingness to adopt digital tools in their work",
        "excellent digital literacy; significant access to digital services; high willingness to adopt digital tools in their work"
      ],
      defaultWeight: 20
    },
    {
      id: "PR.5",
      attribute: "Enabling Infrastructure",
      question: "What is the availability of digital infrastructure in the implementation areas?",
      answers: [
        "limited or no internet access; internet / data is very expensive; users have only feature phones",
        "internet access is generally available; internet / data is expensive; users have only feature phones",
        "internet access is generally available; internet / data is affordable; 25% of users have smartphones",
        "significant internet access; internet / data is affordable; 50% of users have smartphones",
        "extensive and reliable internet access; internet / data is relatively inexpensive; most users have smartphones"
      ],
      defaultWeight: 20
    }
  ]
};

export default function DigitalSolutionScorecard() {
  const [evaluationData, setEvaluationData] = useState(defaultEvaluationData);
  const [candidates, setCandidates] = useState([]);
  const [weights, setWeights] = useState({});
  const [scores, setScores] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({
    "Solution Value and Fit": true,
    "Implementation Cost and Sustainability": false,
    "Project Readiness": false
  });
  const [showResults, setShowResults] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [tempEditValue, setTempEditValue] = useState("");
  const originalValueRef = useRef("");

  useEffect(() => {
    const initialWeights = {};
    Object.entries(evaluationData).forEach(([category, questions]) => {
      questions.forEach(q => {
        initialWeights[q.id] = q.defaultWeight;
      });
    });
    setWeights(initialWeights);
  }, []);

  const addCandidate = () => {
    if (candidates.length < 5) {
      const newId = Date.now();
      setCandidates([...candidates, { id: newId, name: `Solution ${candidates.length + 1}` }]);
    }
  };

  const removeCandidate = (id) => {
    setCandidates(candidates.filter(c => c.id !== id));
    const newScores = { ...scores };
    Object.keys(newScores).forEach(key => {
      if (key.startsWith(`${id}-`)) {
        delete newScores[key];
      }
    });
    setScores(newScores);
  };

  const updateCandidateName = (id, name) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, name } : c));
  };

  const updateWeight = (questionId, value) => {
    setWeights({ ...weights, [questionId]: parseInt(value) || 0 });
  };

  const updateScore = (candidateId, questionId, score) => {
    setScores({ ...scores, [`${candidateId}-${questionId}`]: score });
  };

  const updateProjectScore = (questionId, score) => {
    const newScores = { ...scores };
    candidates.forEach(candidate => {
      newScores[`${candidate.id}-${questionId}`] = score;
    });
    setScores(newScores);
  };

  const toggleCategory = (category) => {
    setExpandedCategories({ ...expandedCategories, [category]: !expandedCategories[category] });
  };

  const startEditingQuestion = (questionId, currentValue) => {
    setEditingQuestion(questionId);
    setTempEditValue(currentValue);
    originalValueRef.current = currentValue;
  };

  const startEditingAnswer = (answerId, currentValue) => {
    setEditingAnswer(answerId);
    setTempEditValue(currentValue);
    originalValueRef.current = currentValue;
  };

  const handleEditKeyDown = (e, category, questionId, answerIndex = null) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Save the changes
      if (answerIndex !== null) {
        setEvaluationData(prev => ({
          ...prev,
          [category]: prev[category].map(q => 
            q.id === questionId ? {
              ...q,
              answers: q.answers.map((a, i) => i === answerIndex ? tempEditValue : a)
            } : q
          )
        }));
        setEditingAnswer(null);
      } else {
        setEvaluationData(prev => ({
          ...prev,
          [category]: prev[category].map(q => 
            q.id === questionId ? { ...q, question: tempEditValue } : q
          )
        }));
        setEditingQuestion(null);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      // Cancel editing without saving
      setEditingQuestion(null);
      setEditingAnswer(null);
      setTempEditValue("");
    }
  };

  const handleEditBlur = () => {
    // On blur, cancel editing without saving
    setEditingQuestion(null);
    setEditingAnswer(null);
    setTempEditValue("");
  };

  const calculateScores = () => {
    const results = {};
    
    candidates.forEach(candidate => {
      results[candidate.id] = {
        name: candidate.name,
        categoryScores: {},
        overallScore: 0,
        solutionValueFit: 0,
        implementationCostSustainability: 0,
        projectReadiness: 0
      };

      let totalWeightedScore = 0;
      let totalWeight = 0;

      Object.entries(evaluationData).forEach(([category, questions]) => {
        let categoryWeightedScore = 0;
        let categoryWeight = 0;

        questions.forEach(q => {
          const score = scores[`${candidate.id}-${q.id}`];
          if (score) {
            const weight = weights[q.id] || 0;
            categoryWeightedScore += score * weight;
            categoryWeight += weight;
          }
        });

        if (categoryWeight > 0) {
          results[candidate.id].categoryScores[category] = categoryWeightedScore / categoryWeight;
          totalWeightedScore += categoryWeightedScore;
          totalWeight += categoryWeight;
        }
      });

      if (totalWeight > 0) {
        results[candidate.id].overallScore = totalWeightedScore / totalWeight;
      }

      results[candidate.id].solutionValueFit = results[candidate.id].categoryScores["Solution Value and Fit"] || 0;
      results[candidate.id].implementationCostSustainability = results[candidate.id].categoryScores["Implementation Cost and Sustainability"] || 0;
      results[candidate.id].projectReadiness = results[candidate.id].categoryScores["Project Readiness"] || 0;
    });

    return results;
  };

  const exportQuestionsAndAnswers = () => {
    let csvContent = "Category,ID,Attribute,Question,Weight,";
    candidates.forEach(c => csvContent += `"${c.name} Answer",`);
    csvContent += "\n";

    Object.entries(evaluationData).forEach(([category, questions]) => {
      questions.forEach(q => {
        csvContent += `"${category}","${q.id}","${q.attribute}","${q.question}","${weights[q.id]}%",`;
        candidates.forEach(c => {
          const score = scores[`${c.id}-${q.id}`];
          const answer = score ? q.answers[score - 1] : "Not answered";
          csvContent += `"${answer}",`;
        });
        csvContent += "\n";
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'scorecard-questions-answers.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const exportToCSV = (results) => {
    let csvContent = "Candidate,Overall Score,Solution Value and Fit,Implementation Cost and Sustainability\n";
    
    Object.entries(results).forEach(([id, result]) => {
      csvContent += `"${result.name}",${result.overallScore.toFixed(2)},${result.solutionValueFit.toFixed(2)},${result.implementationCostSustainability.toFixed(2)}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'scorecard-results.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const exportChartAsPNG = () => {
    const svg = document.querySelector('#quadrant-chart');
    if (!svg) return;
    
    const svgClone = svg.cloneNode(true);
    const svgData = new XMLSerializer().serializeToString(svgClone);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 480;
    canvas.height = 480;
    
    const img = new Image();
    
    img.onload = function() {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(function(blob) {
        if (blob) {
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.href = url;
          link.download = 'scorecard-visual.png';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };
    
    const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
    img.src = 'data:image/svg+xml;base64,' + svgBase64;
  };

  const startNewScorecard = () => {
    setCandidates([]);
    setScores({});
    setShowResults(false);
    const initialWeights = {};
    Object.entries(evaluationData).forEach(([category, questions]) => {
      questions.forEach(q => {
        initialWeights[q.id] = q.defaultWeight;
      });
    });
    setWeights(initialWeights);
  };

  const renderQuadrantChart = (results) => {
    const maxX = 5;
    const maxY = 5;
    const chartSize = 400;
    const padding = 40;
    
    // Calculate average project readiness score
    const projectReadinessScores = Object.values(results).map(r => r.projectReadiness);
    const avgProjectReadiness = projectReadinessScores.length > 0 
      ? (projectReadinessScores.reduce((a, b) => a + b, 0) / projectReadinessScores.length).toFixed(2)
      : '0.00';

    return (
      <div className="mt-8">
        <div className="flex justify-center">
          <svg id="quadrant-chart" width={chartSize + padding * 2} height={chartSize + padding * 2}>
            <rect x={padding} y={padding} width={chartSize} height={chartSize} fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
            
            {/* Quadrant backgrounds */}
            <rect x={padding} y={padding} width={chartSize/2} height={chartSize/2} fill="#3b82f6" opacity="0.1" />
            <rect x={padding + chartSize/2} y={padding} width={chartSize/2} height={chartSize/2} fill="#10b981" opacity="0.1" />
            <rect x={padding} y={padding + chartSize/2} width={chartSize/2} height={chartSize/2} fill="#ef4444" opacity="0.1" />
            <rect x={padding + chartSize/2} y={padding + chartSize/2} width={chartSize/2} height={chartSize/2} fill="#eab308" opacity="0.1" />
            
            <line x1={padding} y1={padding + chartSize/2} x2={padding + chartSize} y2={padding + chartSize/2} stroke="#9ca3af" strokeWidth="2" />
            <line x1={padding + chartSize/2} y1={padding} x2={padding + chartSize/2} y2={padding + chartSize} stroke="#9ca3af" strokeWidth="2" />
            
            <line x1={padding} y1={padding + chartSize} x2={padding + chartSize} y2={padding + chartSize} stroke="#374151" strokeWidth="2" />
            <line x1={padding} y1={padding} x2={padding} y2={padding + chartSize} stroke="#374151" strokeWidth="2" />
            
            <text x={padding + chartSize/2} y={padding + chartSize + 30} textAnchor="middle" className="text-sm font-semibold">
              Implementation Cost and Sustainability →
            </text>
            <text x={15} y={padding + chartSize/2} textAnchor="middle" transform={`rotate(-90, 15, ${padding + chartSize/2})`} className="text-sm font-semibold">
              Solution Value and Fit →
            </text>
            
            <text x={padding + chartSize/4} y={padding + chartSize/4} textAnchor="middle" className="text-gray-700 text-sm font-medium">Larger Projects</text>
            <text x={padding + 3*chartSize/4} y={padding + chartSize/4} textAnchor="middle" className="text-gray-700 text-sm font-medium">Sweet Spot</text>
            <text x={padding + chartSize/4} y={padding + 3*chartSize/4} textAnchor="middle" className="text-gray-700 text-sm font-medium">Least Value</text>
            <text x={padding + 3*chartSize/4} y={padding + 3*chartSize/4} textAnchor="middle" className="text-gray-700 text-sm font-medium">Potentials</text>
            
            {Object.entries(results).map(([id, result], index) => {
              const x = (result.implementationCostSustainability || 0) / maxX * chartSize + padding;
              const y = chartSize - ((result.solutionValueFit || 0) / maxY * chartSize) + padding;
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
              
              return (
                <g key={id}>
                  <circle cx={x} cy={y} r="8" fill={colors[index % colors.length]} />
                  <text x={x} y={y - 12} textAnchor="middle" className="text-xs font-semibold">
                    {result.name}
                  </text>
                </g>
              );
            })}
            
            <text x={padding - 5} y={padding + chartSize + 5} textAnchor="end" className="text-xs">1.0</text>
            <text x={padding - 5} y={padding + 5} textAnchor="end" className="text-xs">5.0</text>
            <text x={padding} y={padding + chartSize + 20} textAnchor="middle" className="text-xs">1.0</text>
            <text x={padding + chartSize} y={padding + chartSize + 20} textAnchor="middle" className="text-xs">5.0</text>
          </svg>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm font-medium">Project Readiness Score: {avgProjectReadiness}</p>
        </div>
      </div>
    );
  };

  const results = showResults ? calculateScores() : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Digital Solution Scorecard for Nonprofits</h1>
          <div className="text-gray-700 space-y-3">
            <p className="text-lg">
              You've published a Request for Proposals (RFP) or Terms of Reference (ToR) for a digital solution to include in your project. 
              You've received responses and are looking to objectively rank the candidates.
            </p>
            <p className="font-semibold text-blue-600">
              Use this app to quickly compare candidates across 2 key dimensions for digital inclusion success:
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li><strong>Solution Value and Fit:</strong> How well does the solution meet user needs and deliver value?</li>
              <li><strong>Implementation Cost and Sustainability:</strong> How cost-effective and long-term sustainable is the solution?</li>
            </ol>
            <p className="mt-3">
              The app will also provide additional context for your decision-making by evaluating your <strong>project's readiness</strong> for digital implementation. The tool includes concrete definitions in a 1-5 Likert scale based on real-world experience deploying digital solutions with smallholder farmers in multiple countries.
            </p>
            <div className="mt-4 bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">How to get started:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li><strong>Step 1:</strong> Click <strong>Add Candidate</strong> and enter the name of a new candidate solution.</li>
                <li><strong>Step 2:</strong> Customize <strong>question weights</strong> based on your project needs, adding up to 100% per category. For example, if user experience is more important to you than market fit, you can increase the weight of Question SVF.2 to 15% and decrease that of SVF.3 to 5%.</li>
                <li><strong>Step 3:</strong> Click <strong>Calculate Results</strong>. The app will calculate category and overall scores per candidate and create a visual ranking. You can then <strong>export the questions and answers, scoring table and/or visual matrix</strong>.</li>
              </ol>
              <p className="mt-3 text-sm text-gray-700">
                <strong>Bonus!</strong> The questions and answers are editable, so you can substitute your definitions for digital solution evaluation. Alternatively, you can update the contents entirely and use this framework to rank multiple options across 2 dimensions with a multiplier that applies uniformly across choices.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Candidate Solutions</h2>
            <button
              onClick={addCandidate}
              disabled={candidates.length >= 5}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                candidates.length >= 5 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Plus size={16} />
              Add Candidate
            </button>
          </div>
          
          {candidates.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No candidates added yet. Click "Add Candidate" to start evaluating solutions.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map(candidate => (
                <div key={candidate.id} className="border rounded-lg p-4 flex items-center gap-3">
                  <input
                    type="text"
                    value={candidate.name}
                    onChange={(e) => updateCandidateName(candidate.id, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeCandidate(candidate.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {candidates.length > 0 && (
          <div className="space-y-6">
            {Object.entries(evaluationData).map(([category, questions]) => {
              const isProjectCategory = category === "Project Readiness";
              
              return (
                <div key={category} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold">{category}</h3>
                      {isProjectCategory && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Note:</strong> This section provides additional context on your project's overall readiness for digital inclusion.
                        </p>
                      )}
                    </div>
                    {expandedCategories[category] ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  
                  {expandedCategories[category] && (
                    <div className="p-6 space-y-6">
                      {questions.map((q) => (
                        <div key={q.id} className="border-b pb-6 last:border-b-0">
                          <div className="mb-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <span className="font-semibold text-gray-700">{q.id}</span>
                                <span className="ml-2 text-gray-600">- {q.attribute}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">Weight:</label>
                                <input
                                  type="number"
                                  value={weights[q.id] || 0}
                                  onChange={(e) => updateWeight(q.id, e.target.value)}
                                  className="w-16 px-2 py-1 border rounded text-center"
                                  min="0"
                                  max="100"
                                />
                                <span className="text-sm text-gray-600">%</span>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              {editingQuestion === q.id ? (
                                <input
                                  type="text"
                                  value={tempEditValue}
                                  onChange={(e) => setTempEditValue(e.target.value)}
                                  onBlur={handleEditBlur}
                                  onKeyDown={(e) => handleEditKeyDown(e, category, q.id)}
                                  className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  autoFocus
                                />
                              ) : (
                                <>
                                  <p className="text-gray-700 flex-1">{q.question}</p>
                                  <button
                                    onClick={() => startEditingQuestion(q.id, q.question)}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {isProjectCategory ? (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="space-y-2">
                                {q.answers.map((answer, index) => (
                                  <label key={index} className="flex items-start gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
                                    <input
                                      type="radio"
                                      name={`project-${q.id}`}
                                      value={index + 1}
                                      checked={candidates.length > 0 && scores[`${candidates[0].id}-${q.id}`] === index + 1}
                                      onChange={() => updateProjectScore(q.id, index + 1)}
                                      className="mt-1"
                                    />
                                    <div className="flex items-start gap-2 flex-1">
                                      {editingAnswer === `${q.id}-${index}` ? (
                                        <input
                                          type="text"
                                          value={tempEditValue}
                                          onChange={(e) => setTempEditValue(e.target.value)}
                                          onBlur={handleEditBlur}
                                          onKeyDown={(e) => handleEditKeyDown(e, category, q.id, index)}
                                          className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          autoFocus
                                        />
                                      ) : (
                                        <>
                                          <span className="text-sm text-gray-600 flex-1">{answer}</span>
                                          <button
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              startEditingAnswer(`${q.id}-${index}`, answer);
                                            }}
                                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
                                            title="Edit answer"
                                          >
                                            <Edit2 size={14} />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {candidates.map(candidate => (
                                <div key={candidate.id} className="bg-gray-50 p-4 rounded-lg">
                                  <p className="font-medium text-gray-700 mb-2">{candidate.name}</p>
                                  <div className="space-y-2">
                                    {q.answers.map((answer, index) => (
                                      <label key={index} className="flex items-start gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
                                        <input
                                          type="radio"
                                          name={`${candidate.id}-${q.id}`}
                                          value={index + 1}
                                          checked={scores[`${candidate.id}-${q.id}`] === index + 1}
                                          onChange={() => updateScore(candidate.id, q.id, index + 1)}
                                          className="mt-1 flex-shrink-0"
                                        />
                                        <div className="flex items-start gap-2 flex-1">
                                          {editingAnswer === `${candidate.id}-${q.id}-${index}` ? (
                                            <input
                                              type="text"
                                              value={tempEditValue}
                                              onChange={(e) => setTempEditValue(e.target.value)}
                                              onBlur={handleEditBlur}
                                              onKeyDown={(e) => handleEditKeyDown(e, category, q.id, index)}
                                              className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                              autoFocus
                                              onClick={(e) => e.stopPropagation()}
                                            />
                                          ) : (
                                            <>
                                              <span className="text-sm text-gray-600 flex-1">{answer}</span>
                                              <button
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  startEditingAnswer(`${candidate.id}-${q.id}-${index}`, answer);
                                                }}
                                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded ml-2"
                                                title="Edit answer"
                                                type="button"
                                              >
                                                <Edit2 size={14} />
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {candidates.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Evaluation Results</h2>
              <button
                onClick={() => setShowResults(!showResults)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {showResults ? 'Hide Results' : 'Calculate Results'}
              </button>
            </div>
            
            {showResults && results && (
              <div>
                <div className="mb-8 overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border px-4 py-2 text-left">Candidate</th>
                        <th className="border px-4 py-2 text-center">Overall Score</th>
                        <th className="border px-4 py-2 text-center">Solution Value and Fit</th>
                        <th className="border px-4 py-2 text-center">Implementation Cost and Sustainability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(results).map(([id, result]) => (
                        <tr key={id}>
                          <td className="border px-4 py-2 font-medium">{result.name}</td>
                          <td className="border px-4 py-2 text-center">
                            <span className="font-bold text-lg">{result.overallScore.toFixed(2)}</span>
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {result.solutionValueFit.toFixed(2)}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {result.implementationCostSustainability.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center">Visual Evaluation Matrix</h3>
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center">
                    <div className="text-xs text-gray-600 mb-2 text-center">
                      <AlertCircle className="inline mr-1" size={14} />
                      Note: Higher score is better.
                    </div>
                  </div>
                  {renderQuadrantChart(results)}
                </div>
                
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={exportQuestionsAndAnswers}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download size={16} />
                    Export Q&A
                  </button>
                  <button
                    onClick={() => exportToCSV(results)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download size={16} />
                    Export Results
                  </button>
                  <button
                    onClick={exportChartAsPNG}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download size={16} />
                    Export Chart
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-center mt-8">
          <button
            onClick={startNewScorecard}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <RefreshCw size={20} />
            Reset Scorecard
          </button>
        </div>
      </div>
    </div>
  );
}