import { StorageService } from '../storageService';
import { ExportService } from '../exportService';
import { Project } from '../../types';

// Mock localStorage for Node environment test runner
class LocalStorageMock {
  private store: { [key: string]: string } = {};
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}

(global as any).localStorage = new LocalStorageMock();

async function runUnitTests() {
  console.log('--- STARTING SCREENCRAFT AI UNIT TESTS ---');
  let testsPassed = 0;
  let testsFailed = 0;

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      testsPassed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      testsFailed++;
    }
  };

  try {
    // Test 1: Empty initial load
    localStorage.clear();
    const initialProjects = StorageService.getProjects();
    assert(Array.isArray(initialProjects) && initialProjects.length === 0, '1. Initial projects list should be empty');

    // Test 2: Create Draft Project (must NOT be saved automatically to storage)
    const draft = StorageService.createDraftProject({ name: 'Flutter Test App' });
    assert(draft.name === 'Flutter Test App', '2a. Draft project should have initial name');
    assert(draft.id.startsWith('proj-'), '2b. Draft project should have valid ID format');

    const afterDraftLoad = StorageService.getProjects();
    assert(afterDraftLoad.length === 0, '2c. Creating a draft project MUST NOT save it to localStorage automatically');

    // Test 3: Save Project (MUST persist to localStorage)
    StorageService.saveProject(draft);
    const afterSaveLoad = StorageService.getProjects();
    assert(afterSaveLoad.length === 1, '3a. Saving a draft project MUST persist it to localStorage');
    assert(afterSaveLoad[0].id === draft.id, '3b. Saved project ID should match draft ID');

    // Test 4: Update Existing Project
    const updatedDraft: Project = {
      ...draft,
      tagline: 'Updated Tagline for Showcase',
    };
    StorageService.saveProject(updatedDraft);
    const afterUpdateLoad = StorageService.getProjects();
    assert(afterUpdateLoad.length === 1, '4a. Updating project should not duplicate entries');
    assert(afterUpdateLoad[0].tagline === 'Updated Tagline for Showcase', '4b. Updated field should persist');

    // Test 5: Delete Project
    StorageService.deleteProject(draft.id);
    const afterDeleteLoad = StorageService.getProjects();
    assert(afterDeleteLoad.length === 0, '5. Deleting project should remove it from storage');

    // Test 6: Export Service HTML & Markdown Generation
    const testProject = StorageService.createDraftProject({
      name: 'Showcase Test App',
      tagline: 'Flutter Showcase',
      techStack: ['Flutter', 'Dart', 'BLoC'],
    });
    const htmlOutput = ExportService.generateHTML(testProject);
    assert(htmlOutput.includes('Showcase Test App'), '6a. HTML Export should contain project name');
    assert(htmlOutput.includes('Flutter'), '6b. HTML Export should contain tech stack');

    const mdOutput = ExportService.generateMarkdown(testProject);
    assert(mdOutput.includes('Showcase Test App'), '6c. Markdown Export should contain project name');

    console.log(`\n--- TEST SUMMARY ---`);
    console.log(`Total Passed: ${testsPassed}`);
    console.log(`Total Failed: ${testsFailed}`);

    if (testsFailed > 0) {
      process.exit(1);
    } else {
      console.log('ALL UNIT TESTS PASSED SUCCESSFULLY! 🎉');
    }
  } catch (err) {
    console.error('Test Suite Exception:', err);
    process.exit(1);
  }
}

runUnitTests();
