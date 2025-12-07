'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Shield, Building2, Users, Lock, Database, FileCheck, DollarSign, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 
  'Education', 'Professional Services', 'Other'
];

const companySizes = [
  '1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '500+ employees'
];

const securityMeasures = [
  'Antivirus Software', 'Firewall', 'Password Manager', 'VPN', 
  'Two-Factor Authentication', 'Email Security', 'None'
];

const securityConcerns = [
  'Data Breaches', 'Phishing Attacks', 'Ransomware', 'Insider Threats',
  'Compliance', 'Password Security', 'Mobile Device Security'
];

const dataTypes = [
  'Customer Data', 'Financial Records', 'Employee Data', 'Intellectual Property',
  'Health Records', 'Payment Information'
];

const complianceRequirements = [
  'GDPR', 'HIPAA', 'PCI DSS', 'SOC 2', 'ISO 27001', 'None'
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession() || {};
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    industryType: '',
    companySize: '',
    currentSecurity: [] as string[],
    primaryConcerns: [] as string[],
    dataTypes: [] as string[],
    complianceRequirements: [] as string[],
    budget: '',
    hasITStaff: false,
  });

  const totalSteps = 6;

  const handleArrayToggle = (field: keyof typeof formData, value: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray?.includes(value)) {
      setFormData({
        ...formData,
        [field]: currentArray.filter((item) => item !== value),
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...(currentArray || []), value],
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Onboarding submission failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.industryType !== '';
      case 2:
        return formData.companySize !== '';
      case 3:
        return formData.currentSecurity.length > 0;
      case 4:
        return formData.primaryConcerns.length > 0;
      case 5:
        return formData.dataTypes.length > 0;
      case 6:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white mb-4"
          >
            <Shield className="h-10 w-10 text-blue-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to SecureBus</h1>
          <p className="text-blue-200">Let's customize your security experience</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-200">Step {step} of {totalSteps}</span>
            <span className="text-sm text-blue-200">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-blue-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">What industry are you in?</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => setFormData({ ...formData, industryType: industry })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.industryType === industry
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">How many employees do you have?</h2>
                </div>
                <div className="space-y-3">
                  {companySizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setFormData({ ...formData, companySize: size })}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.companySize === size
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Lock className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">Current security measures?</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
                <div className="grid grid-cols-2 gap-3">
                  {securityMeasures.map((measure) => (
                    <button
                      key={measure}
                      onClick={() => handleArrayToggle('currentSecurity', measure)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.currentSecurity?.includes(measure)
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {measure}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">What are your primary security concerns?</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
                <div className="grid grid-cols-2 gap-3">
                  {securityConcerns.map((concern) => (
                    <button
                      key={concern}
                      onClick={() => handleArrayToggle('primaryConcerns', concern)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.primaryConcerns?.includes(concern)
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {concern}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Database className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">What types of data do you handle?</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
                <div className="grid grid-cols-2 gap-3">
                  {dataTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleArrayToggle('dataTypes', type)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.dataTypes?.includes(type)
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <FileCheck className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">Additional Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Compliance Requirements (select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {complianceRequirements.map((req) => (
                        <button
                          key={req}
                          onClick={() => handleArrayToggle('complianceRequirements', req)}
                          className={`p-3 rounded-lg border-2 transition-all text-sm ${
                            formData.complianceRequirements?.includes(req)
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                          }`}
                        >
                          {req}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Monthly Security Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">Select a budget range</option>
                      <option value="Under $500">Under $500</option>
                      <option value="$500 - $1,000">$500 - $1,000</option>
                      <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                      <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                      <option value="Over $10,000">Over $10,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasITStaff}
                        onChange={(e) => setFormData({ ...formData, hasITStaff: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium">We have dedicated IT/Security staff</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-8 border-t">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center space-x-2 px-6 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium transition-all hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium transition-all hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Finishing...' : 'Complete Setup'}
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
