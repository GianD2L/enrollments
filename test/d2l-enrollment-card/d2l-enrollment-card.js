describe('d2l-enrollment-card', () => {

	var component,
		fetchStub,
		sandbox,
		enrollmentEntity,
		organizationEntity,
		presentationEntity,
		semesterOrganizationEntity;

	function SetupFetchStub(url, entity) {
		fetchStub.withArgs(sinon.match.has('url', sinon.match(url)))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(entity); }
			}));
	}

	function loadEnrollment(done) {
		var spy = sandbox.spy(component, '_handleOrganizationResponse');

		component.href = '/enrollments/users/169/organizations/1';
		component.presentationHref = '/d2l/le/manageCourses/homepage-component/1';

		setTimeout(() => {
			expect(spy).to.have.been.calledOnce;
			done();
		});
	}

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		enrollmentEntity = window.D2L.Hypermedia.Siren.Parse({
			class: ['pinned', 'enrollment'],
			rel: ['https://api.brightspace.com/rels/user-enrollment'],
			actions: [{
				name: 'unpin-course',
				method: 'PUT',
				href: '/enrollments/users/169/organizations/1',
				fields: [{
					name: 'pinned',
					type: 'hidden',
					value: false
				}]
			}],
			links: [{
				rel: ['https://api.brightspace.com/rels/organization'],
				href: '/organizations/1'
			}, {
				rel: ['self'],
				href: '/enrollments/users/169/organizations/1'
			}]
		});
		organizationEntity = window.D2L.Hypermedia.Siren.Parse({
			class: ['active', 'course-offering'],
			properties: {
				name: 'Course name',
				code: 'COURSE100',
				startDate: '2050-01-01T00:00:00.000Z',
				endDate: null,
				isActive: true
			},
			links: [{
				rel: ['self'],
				href: '/organizations/1'
			}, {
				rel: ['https://api.brightspace.com/rels/organization-homepage'],
				href: 'http://example.com/1/home',
				type: 'text/html'
			}, {
				rel: ['https://notifications.api.brightspace.com/rels/organization-notifications'],
				href: '/organizations/1/my-notifications'
			}, {
				rel: ['https://api.brightspace.com/rels/parent-semester'],
				href: '/organizations/2'
			}, {
				rel: ['https://api.brightspace.com/rels/course-offering-info-page'],
				href: 'http://example.com/1/info',
				type: 'text/html'
			}],
			entities: [{
				class: ['course-image'],
				propeties: {
					name: '1.jpg',
					type: 'image/jpeg'
				},
				rel: ['https://api.brightspace.com/rels/organization-image'],
				links: [{
					rel: ['self'],
					href: '/organizations/1/image'
				}, {
					rel: ['alternate'],
					href: '',
					class: ['tile']
				}]
			}, {
				class: ['relative-uri'],
				rel: ['item', 'https://api.brightspace.com/rels/organization-homepage'],
				properties: {
					path: 'http://example.com/1/home'
				}
			}],
			actions: [{
				href: '/d2l/api/lp/1.9/courses/6609/image',
				name: 'set-catalog-image',
				method: 'POST',
				fields: [{
					type: 'text',
					name: 'imagePath',
					value: ''
				}]
			}]
		});
		semesterOrganizationEntity = window.D2L.Hypermedia.Siren.Parse({
			class: ['active', 'semester'],
			properties: {
				name: 'Test Semester',
				code: 'SEM169'
			},
			links: [{
				rel: ['https://api.brightspace.com/rels/organization-homepage'],
				href: 'http://example.com/2/home',
				type: 'text/html'
			}, {
				rel: ['https://notifications.api.brightspace.com/rels/organization-notifications'],
				href: '/organizations/2/my-notifications'
			}, {
				rel: ['self'],
				href: '/organizations/2'
			}],
			entities: [{
				class: ['course-image'],
				propeties: {
					name: '2.jpg',
					type: 'image/jpeg'
				},
				rel: ['https://api.brightspace.com/rels/organization-image'],
				links: [{
					rel: ['self'],
					href: '/organizations/2/image'
				}, {
					rel: ['alternate'],
					href: '',
					class: ['tile']
				}]
			}, {
				class: ['relative-uri'],
				rel: ['item', 'https://api.brightspace.com/rels/organization-homepage'],
				properties: {
					path: 'http://example.com/2/home'
				}
			}]
		});
		presentationEntity = window.D2L.Hypermedia.Siren.Parse({
			properties: {
				ShowCourseCode: false,
				ShowSemester: false,
				ShowUnattemptedQuizzes: false,
				ShowDropboxUnreadFeedback: false,
				ShowUngradedQuizAttempts: false,
				ShowUnreadDiscussionMessages: false,
				ShowUnreadDropboxSubmissions: false
			},
			links: [{
				rel: ['https://api.brightspace.com/rels/user-settings'],
				href: ''
			}, {
				rel: ['self'],
				href: '/d2l/le/manageCourses/homepage-component/1'
			}]
		});

		fetchStub = sandbox.stub(window.d2lfetch, 'fetch');
		SetupFetchStub(/\/enrollments\/users\/169\/organizations\/1$/, enrollmentEntity);
		SetupFetchStub(/\/organizations\/1$/, organizationEntity);
		SetupFetchStub(/\/organizations\/2$/, semesterOrganizationEntity);
		SetupFetchStub(/\/organizations\/1\/image/, {});
		SetupFetchStub(/\/organizations\/1\/my-notifications$/, { properties: {} });
		SetupFetchStub(/\/d2l\/le\/manageCourses\/homepage-component\/1/, presentationEntity);

		component = fixture('d2l-enrollment-card-fixture');
		component._load = true;
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('loads element', () => {
		expect(component).to.exist;
	});

	describe('Public API', () => {

		it('should implement all properties', () => {
			expect(component.href).to.equal(null);
			expect(component.presentationHref).to.equal(null);
		});

		it('should implement refreshImage', () => {
			expect(component.refreshImage).to.be.a('function');
		});

	});

	describe('Setting the enrollment attribute', () => {

		beforeEach(done => loadEnrollment(done));

		it('should set the enrollment href', () => {
			expect(component.href).to.equal('/enrollments/users/169/organizations/1');
		});

		it('should set presentation href', () => {
			expect(component.presentationHref).to.equal('/d2l/le/manageCourses/homepage-component/1');
		});

		it('should fetch the organization', () => {
			expect(component._organization).to.equal(organizationEntity);
		});

		it('should set the Course Offering Information URL', () => {
			expect(component._courseInfoUrl).to.equal('http://example.com/1/info');
		});

		it('should set the semester organization URL', () => {
			expect(component._semesterUrl).to.equal('/organizations/2');
		});

		it('should set the notifications URL', () => {
			expect(component._notificationsUrl).to.equal('/organizations/1/my-notifications');
		});

		it('should set the image entity', () => {
			expect(component._image).to.equal(organizationEntity.entities[0]);
		});

		it('should set the homepage URL', () => {
			expect(component._organizationHomepageUrl).to.equal('http://example.com/1/home');
		});

		it('should set the pin state', () => {
			expect(component._pinned).to.equal(true);
		});

	});

	describe('Updating the organization', () => {

		it('should update _canAccessCourseInfo', () => {
			var spy = sandbox.spy(component, '_computeCanAccessCourseInfo');

			component._organization = organizationEntity;

			expect(spy).to.have.been.called;
			expect(component._canAccessCourseInfo).to.equal(true);
		});

		it('should update _canChangeCourseImage', () => {
			var spy = sandbox.spy(component, '_computeCanChangeCourseImage');

			component._organization = organizationEntity;

			expect(spy).to.have.been.called;
			expect(component._canChangeCourseImage).to.equal(true);
		});

		it('should update _courseSettingsLabel', () => {
			var spy = sandbox.spy(component, '_computeCourseSettingsLabel');

			component._organization = organizationEntity;

			expect(spy).to.have.been.called;
			expect(component._courseSettingsLabel).to.equal('Course name course settings');
		});

		it('should update _overlayAnnounceText', () => {
			var spy = sandbox.spy(component, '_computeOverlayAnnounceText');

			component._organization = organizationEntity;

			expect(spy).to.have.been.called;
			expect(component._overlayAnnounceText).to.match(/Opens on/);
		});

		it('should update _pinButtonLabel', () => {
			var spy = sandbox.spy(component, '_computePinButtonLabel');

			component._organization = organizationEntity;

			expect(spy).to.have.been.called;
			expect(component._pinButtonLabel).to.equal('Course name is pinned. Unpin course');
		});

		it('should update the course name', () => {
			component._organization = organizationEntity;

			var courseText = component.$$('.course-text');
			expect(courseText.innerText).to.contain(organizationEntity.properties.name);
		});

		describe('Course code', () => {

			it('should show the course code if configured true', done => {
				presentationEntity.properties.ShowCourseCode = true;
				component._presentation = presentationEntity.properties;

				var courseCode = component.$$('.course-code-text');

				setTimeout(() => {
					expect(courseCode.hasAttribute('hidden')).to.be.false;
					done();
				});
			});

			it('should not show the course code if configured false', done => {
				presentationEntity.properties.ShowCourseCode = false;
				component._presentation = presentationEntity.properties;

				var courseCode = component.$$('.course-code-text');

				setTimeout(() => {
					expect(courseCode.hasAttribute('hidden')).to.be.true;
					done();
				});

			});

		});

	});

	describe('Semester name', () => {

		beforeEach(done => loadEnrollment(done));

		it('should show the semester if the showSemester is set', done => {
			presentationEntity.properties.ShowSemester = true;
			component._presentation = {};
			component._presentation = presentationEntity.properties;

			var semester = component.$$('.semester-text');
			setTimeout(() => {
				expect(semester.innerText).to.equal(semesterOrganizationEntity.properties.name);
				expect(semester.hasAttribute('hidden')).to.be.false;
				done();
			});
		});

		it('should not set the semester name if the show semester config is false', done => {
			var spy = sandbox.spy(component, '_fetchSirenEntity');

			presentationEntity.properties.ShowCourseCode = false;
			component._notificationsUrl = false;
			component._presentation = {};
			component._presentation = presentationEntity.properties;

			var semester = component.$$('.semester-text');
			setTimeout(() => {
				expect(spy).to.have.not.been.called;
				expect(semester.hasAttribute('hidden')).to.be.true;
				done();
			});

		});

	});

	describe('Separator between course code and semester name', () => {

		function testName(testCase) {
			return 'should ' + (testCase.showSeparator ? '' : ' not ')
				+ 'show the separator when '
				+ 'showCourseCode=' + testCase.showCourseCode + ', '
				+ 'showSemester=' + testCase.showSemester + ', '
				+ 'semesterName="' + testCase.semesterName + '", '
				+ 'courseCode="' + testCase.courseCode + '"';
		}

		[
			{ showCourseCode: false, showSemester: false, semesterName: '', courseCode: '', showSeparator: false },
			{ showCourseCode: false, showSemester: true, semesterName: '', courseCode: '', showSeparator: false },
			{ showCourseCode: false, showSemester: true, semesterName: 'foo', courseCode: '', showSeparator: false },
			{ showCourseCode: false, showSemester: true, semesterName: 'foo', courseCode: 'bar', showSeparator: false },
			{ showCourseCode: true, showSemester: false, semesterName: '', courseCode: '', showSeparator: false },
			{ showCourseCode: true, showSemester: false, semesterName: '', courseCode: 'bar', showSeparator: false },
			{ showCourseCode: true, showSemester: true, semesterName: '', courseCode: 'bar', showSeparator: false },
			{ showCourseCode: true, showSemester: true, semesterName: 'foo', courseCode: 'bar', showSeparator: true }
		].forEach(testCase => {

			it(testName(testCase), () => {
				presentationEntity.properties.ShowCourseCode = testCase.showCourseCode;
				presentationEntity.properties.ShowSemester = testCase.showSemester;
				component._presentation = presentationEntity.properties;
				component._organization = organizationEntity;
				component._organization.properties.code = testCase.courseCode;
				component._semesterName = testCase.semesterName;

				var separator = component.$$('.separator-icon');
				expect(separator.hasAttribute('hidden')).to.equal(!testCase.showSeparator);
			});

		});

	});

	describe('Pinning functionality', () => {

		beforeEach(done => loadEnrollment(done));

		it('should have a visible "Unpin" menu item when pinned', () => {
			component._pinned = true;

			var unpinMenuItem = component.$$('d2l-menu-item.d2l-menu-item-last');

			expect(unpinMenuItem).to.not.be.null;
			expect(unpinMenuItem.text).to.equal('Unpin');
		});

		it('should have a visible "Pin" menu item when pinned', () => {
			component._pinned = false;

			var pinMenuItem = component.$$('d2l-menu-item.d2l-menu-item-last');
			expect(pinMenuItem).to.not.be.null;
			expect(pinMenuItem.text).to.equal('Pin');
		});

		it('should have a visible pinned button when pinned', () => {
			component._pinned = true;

			var pinButton = component.$$('.pin-indicator:not([hidden])');
			expect(pinButton).to.not.be.null;
		});

		it('should hide the pinned button when unpinned', () => {
			component._pinned = false;

			var pinButton = component.$$('.pin-indicator:not([hidden])');
			expect(pinButton).to.be.null;
		});

		it('should set the update action parameters correctly and call the pinning API', done => {
			SetupFetchStub('/enrollments/users/169/organizations/1', enrollmentEntity);

			component._pinClickHandler();

			setTimeout(() => {
				expect(fetchStub).to.have.been
					.calledWith(sinon.match.has('url', sinon.match('/enrollments/users/169/organizations/1'))
						.and(sinon.match.has('method', 'PUT')));
				done();
			});
		});

		it('should aria-announce the change in pin state', done => {
			SetupFetchStub('/enrollments/users/169/organizations/1', enrollmentEntity);

			component.addEventListener('iron-announce', function(e) {
				expect(e.detail.text).to.equal('Course name has been unpinned');
				done();
			});

			component._pinClickHandler();
		});

	});

	describe('set-course-image event', () => {

		beforeEach(done => loadEnrollment(done));

		it('should have a change-image-button if the set-catalog-image action exists on the organization', () => {
			var changeImageMenuItem = component.$$('d2l-menu-item:not([hidden])').$$('span');
			expect(changeImageMenuItem).to.not.be.null;
			expect(changeImageMenuItem.innerText).to.equal('Change Image');
		});

		it('should not have a change-image-button if the set-catalog-image action does not exist on the organization', () => {
			organizationEntity.actions = [];
			component._organization = window.D2L.Hypermedia.Siren.Parse(
				JSON.parse(JSON.stringify(organizationEntity))
			);
			var changeImageMenuItem = component.$$('d2l-menu-item[hidden]');
			expect(changeImageMenuItem).to.not.be.null;
			expect(changeImageMenuItem.text).to.contain('Change Image');
		});

		it('shows the loading spinner overlay when event status=set', () => {
			window.dispatchEvent(new CustomEvent('set-course-image', {
				detail: {
					organization: organizationEntity,
					status: 'set'
				}
			}));

			var imageOverlay = component.$$('div.overlay:nth-of-type(3)');
			expect(imageOverlay.hasAttribute('hidden')).to.be.false;
			var spinner = component.$$('.overlay d2l-loading-spinner');
			expect(spinner.hasAttribute('hidden')).to.be.false;
		});

		it('hides the loading spinner overlay and shows the checkmark when event status=success', () => {
			var clock = sinon.useFakeTimers();

			window.dispatchEvent(new CustomEvent('set-course-image', {
				detail: {
					organization: organizationEntity,
					status: 'success'
				}
			}));

			clock.tick(1001);
			var imageOverlay = component.$$('div.overlay:nth-of-type(3)');
			expect(imageOverlay.hasAttribute('hidden')).to.be.false;
			var spinner = component.$$('.overlay d2l-loading-spinner');
			expect(spinner.hasAttribute('hidden')).to.be.true;
			var icon = component.$$('.overlay .icon-container d2l-icon');
			expect(icon.getAttribute('icon')).to.equal('d2l-tier2:check');

			clock.tick(1001);
			expect(imageOverlay.hasAttribute('hidden')).to.be.true;
			clock.restore();
		});

		it('hides the loading spinner overlay and shows the X icon when event status=failure', () => {
			var clock = sinon.useFakeTimers();

			window.dispatchEvent(new CustomEvent('set-course-image', {
				detail: {
					organization: organizationEntity,
					status: 'failure'
				}
			}));

			clock.tick(1001);
			var imageOverlay = component.$$('div.overlay:nth-of-type(3)');
			expect(imageOverlay.hasAttribute('hidden')).to.be.false;
			var spinner = component.$$('.overlay d2l-loading-spinner');
			expect(spinner.hasAttribute('hidden')).to.be.true;
			var icon = component.$$('.overlay .icon-container d2l-icon');
			expect(icon.getAttribute('icon')).to.equal('d2l-tier3:close');

			clock.tick(1001);
			expect(imageOverlay.hasAttribute('hidden')).to.be.true;
			clock.restore();
		});

	});

	describe('Course updates functionality', () => {

		beforeEach(done => loadEnrollment(done));

		function testName(testCase) {
			return 'should show ' +
				(testCase.updatesShown ? testCase.updateString : 'nothing') +
				' when updates=' + testCase.count;
		}

		[
			{ count: -1, updateString: '-1', updatesShown: false },
			{ count: 0, updateString: '0', updatesShown: false },
			{ count: 1, updateString: '1', updatesShown: true },
			{ count: 99, updateString: '99', updatesShown: true },
			{ count: 100, updateString: '99+', updatesShown: true },
		].forEach(testCase => {

			it(testName(testCase), done => {
				fetchStub.restore();
				fetchStub = sandbox.stub(window.d2lfetch, 'fetch');
				SetupFetchStub(/\/organizations\/1\/my-notifications$/, {
					properties: {
						UnattemptedQuizzes: testCase.count,
						UnreadAssignmentFeedback: 0,
						UngradedQuizzes: 0,
						UnreadDiscussions: 0,
						UnapprovedDiscussions: 0,
						UnreadAssignmentSubmissions: 0
					}
				});

				presentationEntity.properties.ShowUnattemptedQuizzes = true;
				component._presentation = {};
				component._presentation = presentationEntity.properties;
				setTimeout(() => {
					expect(component._showUpdateCount).to.equal(testCase.updatesShown);
					expect(component._updateCount).to.equal(testCase.count);
					var updateString = component.$$('.update-text-box').innerText;
					expect(updateString).to.equal(testCase.updateString);
					done();
				});

			});

		});

	});

	describe('Notification Overlay', () => {

		var futureDate = new Date(3000, 0, 1, 15, 5).toISOString(),
			pastDate = new Date(1900, 3, 30, 4, 38).toISOString(),
			formattedFutureDateTime = 'Jan 1, 3000 3:05 PM',
			formattedPastDateTime = 'Apr 30, 1900 4:38 AM';

		[
			{ start: futureDate, end: futureDate, active: false },
			{ start: futureDate, end: futureDate, active: true },
			{ start: pastDate, end: pastDate, active: false },
			{ start: pastDate, end: pastDate, active: true },
			{ start: pastDate, end: futureDate, active: false },
			{ start: pastDate, end: futureDate, active: true },
			{ start: null, end: futureDate, active: false },
			{ start: null, end: futureDate, active: true }
		].forEach(testCase => {

			it(`${testCase.start}, ${testCase.end}, ${testCase.active}`, () => {
				organizationEntity.properties.startDate = testCase.start;
				organizationEntity.properties.endDate = testCase.end;
				organizationEntity.properties.isActive = testCase.active;
				component._organization = organizationEntity;

				var overlay = component.$$('div.overlay:nth-of-type(2):not([hidden])');
				if (
					testCase.end === futureDate
					&& (testCase.start === pastDate || !testCase.start)
					&& testCase.active
				) {
					expect(overlay).to.be.null;
					return;
				}
				expect(overlay).to.not.be.null;

				var overlayTitleText = overlay.querySelector('.overlay-text').innerText;
				var overlayDateText = overlay.querySelector('.overlay-date').innerText;
				var overlayInactiveText = overlay.querySelector('.overlay-date + div').innerText;

				if (testCase.start === futureDate) {
					expect(overlayTitleText).to.equal('Opens On');
					expect(overlayDateText).to.equal(formattedFutureDateTime);
				} else if (testCase.end === pastDate) {
					expect(overlayTitleText).to.equal('Closed');
					expect(overlayDateText).to.equal(formattedPastDateTime);
				} else {
					expect(overlayTitleText).to.be.empty;
					expect(overlayDateText).to.be.empty;
				}

				if (testCase.active || testCase.end === pastDate) {
					expect(overlayInactiveText).to.be.empty;
				} else if (testCase.start === futureDate) {
					expect(overlayInactiveText).to.equal('(Inactive)');
				} else {
					expect(overlayInactiveText).to.equal('Inactive');
				}

			});

		});

	});

});