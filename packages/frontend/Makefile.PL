use strict;
use warnings;
use ExtUtils::MakeMaker;

WriteMakefile(
  VERSION   => '0.01',
  PREREQ_PM => {
    'Mojolicious'                       => '9.37',
    'Mojolicious::Plugin::Status'       => '1.17',
    'JSON'                              => 'any',
    'JSON::PP'                          => 'any',
    'Cpanel::JSON::XS'                  => 'any',
    'JSON::MaybeXS'                     => 'any',
    'Dist::Zilla'                       => 'any',
    'Dist::Zilla::Plugin::Git'          => 'any',
    'Dist::Zilla::PluginBundle::Git'    => 'any',
    'Pod::Weaver'                       => 'any',
    'Pod::Elemental::Transformer'       => 'any',
    'Pod::Elemental::Transformer::List' => 'any',
    'Plack'                             => 'any',
  },
  test_requires => {
      'Test::Pod'             => 'any',
      'Test::Pod::Coverage'   => 'any',
      'Test2::Tools::Process' => 'any'
  },
  test => {TESTS => 't/*.t'}
);
