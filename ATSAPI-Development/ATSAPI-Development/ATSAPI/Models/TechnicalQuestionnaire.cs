using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class TechnicalQuestionnaire
    {
        public TechnicalQuestionnaire()
        {
            technicalPracticeSkillForm = new TechPracticeSkill();
            fundamentalKnowledgForm = new FundamentalKnowleadge();
            prblmSolvingSkillForm = new ProblmSolving();
            industryDomainKnowledgForm = new IndustryDomainKnowleadge();
            CulturatFitAdaptabilityForm = new CulturalFitAdaptability();
        }
        public int cid { get; set; }
        public int roundId { get; set; }
        public TechPracticeSkill technicalPracticeSkillForm { get; set; }
        public FundamentalKnowleadge fundamentalKnowledgForm { get; set; }
        public ProblmSolving prblmSolvingSkillForm { get; set; }
        public IndustryDomainKnowleadge industryDomainKnowledgForm { get; set; }
        public CulturalFitAdaptability CulturatFitAdaptabilityForm { get; set; }
        public char isSaveOrDraft { get; set; }
    }

    public class TechPracticeSkill
    {
        public string familiarProgramTechnolog { get; set; }
        public string technicalSkillsEvaluat { get; set; }
        public char candidateCodingChallenge { get; set; }
        public byte[] techFileBase64 { get; set; }
        public string techFileName { get; set; }
        public string techFilePath { get; set; }
    }

    public class FundamentalKnowleadge
    {
        public string assessRoleKnowledg { get; set; }
    }
    public class ProblmSolving
    {
        public string candidateApprochComplexPrblm { get; set; }
        public string candidatePrblmSolvingApproch { get; set; }

    }
    public class IndustryDomainKnowleadge
    {
        public string candidatePossesIndustryDomExp { get; set; }

    }

    public class CulturalFitAdaptability
    {
        public string candidateFitForInfogain { get; set; }
        public string candidateAbilityToAdoptChangeWork { get; set; }
    }

  

}