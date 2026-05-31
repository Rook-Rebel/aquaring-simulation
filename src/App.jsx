import { useState, useCallback } from 'react'
import './index.css'
import Hero from './components/Hero'
import Simulation from './components/Simulation'
import ControlPanel from './components/ControlPanel'
import FormulaSection from './components/FormulaSection'
import DataDashboard from './components/DataDashboard'
import ParticleSection from './components/ParticleSection'
import ResearchSection from './components/ResearchSection'
import DeviceSection from './components/DeviceSection'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'

const computeEfficiency = (freq, pipeDiameter, power, flowRate, pollutant) => {
  const diamM = pipeDiameter / 1000
  const recommended = 1480 / (2 * diamM)
  const freqHz = freq * 1000
  const diff = Math.abs(freqHz - recommended)
  const freqScore = Math.max(0, 1 - diff / recommended)

  const powerScore = power / 100
  const flowPenalty = Math.max(0, 1 - (flowRate - 0.2) / 2.2)

  let base = freqScore * 0.5 + powerScore * 0.3 + flowPenalty * 0.2

  const pollutantMod = {
    rust: 1.0,
    sediment: 0.95,
    microplastic: 0.85,
    mixed: 0.75,
  }
  base *= (pollutantMod[pollutant] || 1.0)

  return Math.round(Math.min(98, Math.max(8, base * 100)))
}

export default function App() {
  const [selectedPollutant, setSelectedPollutant] = useState('mixed')
  const [flowRate, setFlowRate] = useState(0.8)
  const [pipeDiameter, setPipeDiameter] = useState(25)
  const [frequency, setFrequency] = useState(30)
  const [power, setPower] = useState(80)
  const [isRunning, setIsRunning] = useState(false)
  const [isFlushing, setIsFlushing] = useState(false)
  const [tankLevel, setTankLevel] = useState(0)
  const [mode, setMode] = useState('ლოდინი')

  const efficiency = isRunning
    ? computeEfficiency(frequency, pipeDiameter, power, flowRate, selectedPollutant)
    : 0

  const startRing = useCallback(() => {
    setIsRunning(true)
    setIsFlushing(false)
    setMode('აკუსტიკური წმენდა')
    setTankLevel(prev => Math.min(85, prev + 5))
  }, [])

  const stopRing = useCallback(() => {
    setIsRunning(false)
    setIsFlushing(false)
    setMode('გაჩერებულია')
  }, [])

  const flushTank = useCallback(() => {
    setIsFlushing(true)
    setMode('თვითწმენდა')
    setTimeout(() => {
      setTankLevel(0)
      setIsFlushing(false)
      if (isRunning) setMode('აკუსტიკური წმენდა')
      else setMode('ლოდინი')
    }, 3000)
  }, [isRunning])

  const refreshData = useCallback(() => {
    if (isRunning) {
      setTankLevel(prev => Math.min(95, prev + Math.random() * 8 + 3))
    }
  }, [isRunning])

  const scrollToSim = () => {
    document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' })
  }
  const scrollToHow = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  const state = {
    selectedPollutant, flowRate, pipeDiameter, frequency, power,
    isRunning, isFlushing, tankLevel, mode, efficiency,
  }

  const actions = {
    setSelectedPollutant, setFlowRate, setPipeDiameter,
    setFrequency, setPower, startRing, stopRing, flushTank, refreshData,
  }

  return (
    <div style={{ background: 'var(--blue-deep)', minHeight: '100vh' }}>
      <Hero onStart={scrollToSim} onHow={scrollToHow} />
      <div className="section-sep" />
      <Simulation state={state} />
      <div className="section-sep" />
      <ControlPanel state={state} actions={actions} />
      <div className="section-sep" />
      <FormulaSection pipeDiameter={pipeDiameter} frequency={frequency} efficiency={efficiency} isRunning={isRunning} />
      <div className="section-sep" />
      <DataDashboard state={state} />
      <div className="section-sep" />
      <ParticleSection />
      <div className="section-sep" />
      <HowItWorks />
      <div className="section-sep" />
      <DeviceSection />
      <div className="section-sep" />
      <ResearchSection />
      <div className="section-sep" />
      <Footer />
    </div>
  )
}
